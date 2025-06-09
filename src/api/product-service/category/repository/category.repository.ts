import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Category } from "../schemas/category.schema";
import { Model, Types } from "mongoose";
import { SharedUtilsService } from "src/common/utils/shared-utils.service";
import { UploadService } from "src/api/upload-service/upload/upload.service";
import { CategoryUtilsService } from "../utils/category-utils.service";
import { CreateCategoryOptions, CreateRootCategoryOptions, CreateSubCategoryOptions, ICategoryRepository } from "./category.repository.interface";

Injectable()
export class CategoryRepository implements ICategoryRepository {
    constructor(
        @InjectModel(Category.name) private categoryModel: Model<Category>,
        private readonly sharedUtilsService: SharedUtilsService,
        private readonly categoryUtilsService: CategoryUtilsService,
        private readonly uploadService: UploadService,
    ) { }

    async createRootCategory(params: CreateRootCategoryOptions): Promise<void> {
        const { payload, session } = params
        // Find the last category based on the right value.
        const lastCategory = await this.categoryModel.findOne().sort({ right: -1 }).session(session)
        // Determine the left and right values for the new root category.
        const newCategory = {
            ...payload,
            left: lastCategory ? lastCategory.right + 1 : 1,
            right: lastCategory ? lastCategory.right + 2 : 2,
            parent: null,
        }

        await this.categoryModel.create([newCategory], { session })
    }

    async createSubCategory(params: CreateSubCategoryOptions): Promise<void> {
        const { parentId, payload, session } = params
        // Find the parent category by ID.
        const parentCategory = await this.categoryModel.findById(parentId).session(session)
        if (!parentCategory) throw new BadRequestException('Such a category could not be found.')

        // Get the right value of the parent category.
        const parentRight = parentCategory.right
        const operations = [
            // Update the right values of categories with right values greater than or equal to the parent's right value.
            { updateMany: { filter: { right: { $gte: parentRight } }, update: { $inc: { right: 2 } } } },
            // Update the left values of categories with left values greater than the parent's right value.
            { updateMany: { filter: { left: { $gt: parentRight } }, update: { $inc: { left: 2 } } } },
            // Create the new subcategory with the appropriate left and right values.
            { insertOne: { document: { ...payload, left: parentRight, right: parentRight + 1, parent: parentId } } },
        ]

        try {
            await this.categoryModel.bulkWrite(operations, { session })
        } catch (error) {
            throw error
        }
    }

    async create(params: CreateCategoryOptions): Promise<void> {
        const { payload, uploadedImage } = params
        await this.sharedUtilsService.executeTransaction(async (session) => {
            const [savedImage, savedIcon] = await Promise.all([
                this.uploadService.createImage(uploadedImage.image[0], session),
                this.uploadService.createImage(uploadedImage.icon[0], session)
            ])

            const categoryData = { ...payload, icon: savedIcon as Types.ObjectId, image: savedImage as Types.ObjectId }
            payload.parent
                ? await this.createSubCategory({ payload: categoryData, parentId: payload.parent, session })
                : await this.createRootCategory({ payload: categoryData, session })
        })
    }

    async findLeafs(): Promise<Category[]> {
        return this.categoryModel.find({ $expr: { $eq: ['$right', { $add: ['$left', 1] }] } })
            .sort({ view_count: -1 })
            .limit(30)
            .lean()
    }

    async findRoots(): Promise<Category[]> {
        return await this.categoryModel.find({ parent: null })
            .sort({ view_count: -1 })
            .lean()
    }

    async findTree(categoryId: Types.ObjectId) {
        const category = await this.categoryModel.findById(categoryId)
        if (!category) return []

        const rootCategory = await this.categoryModel.findOne({
            left: { $lte: category.left },
            right: { $gte: category.right },
            parent: null,
        }).sort({ right: 1 })
        if (!rootCategory) return []

        const categories = await this.categoryModel.find({
            right: { $lte: rootCategory.right },
            left: { $gte: rootCategory.left },
        }).sort({ view_count: - 1 })

        return this.categoryUtilsService.buildCategoryTree({ categoryId, categories })
    }
}