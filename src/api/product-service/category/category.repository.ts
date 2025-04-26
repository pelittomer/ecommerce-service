import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Category } from "./schemas/category.schema";
import { ClientSession, Model, Types } from "mongoose";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { SharedUtilsService } from "src/common/utils/shared-utils.service";
import { UploadService } from "src/api/upload-service/upload/upload.service";

Injectable()
export class CategoryRepository {
    constructor(
        @InjectModel(Category.name) private categoryModel: Model<Category>,
        private readonly sharedUtilsService: SharedUtilsService,
        private readonly uploadService: UploadService,
    ) { }

    async createRootCategory(userInputs: Partial<Category>, session: ClientSession) {
        // Find the last category based on the right value.
        const lastCategory = await this.categoryModel.findOne().sort({ right: -1 }).session(session)
        // Determine the left and right values for the new root category.
        const newCategory = {
            ...userInputs,
            left: lastCategory ? lastCategory.right + 1 : 1,
            right: lastCategory ? lastCategory.right + 2 : 2,
            parent: null,
        }

        await this.categoryModel.create([newCategory], { session })
    }

    async createSubCategory(userInputs: Partial<Category>, parentId: Types.ObjectId, session: ClientSession) {
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
            { insertOne: { document: { ...userInputs, left: parentRight, right: parentRight + 1, parent: parentId } } },
        ]

        try {
            await this.categoryModel.bulkWrite(operations, { session })
        } catch (error) {
            throw error
        }
    }

    async create(userInputs: CreateCategoryDto, uploadedImage: { image: Express.Multer.File[], icon: Express.Multer.File[] }) {
        await this.sharedUtilsService.executeTransaction(async (session) => {
            const [savedImage, savedIcon] = await Promise.all([
                this.uploadService.createImage(uploadedImage.image[0], session),
                this.uploadService.createImage(uploadedImage.icon[0], session)
            ])

            const categoryData = { ...userInputs, icon: savedIcon._id as Types.ObjectId, image: savedImage._id as Types.ObjectId }
            userInputs.parent
                ? await this.createSubCategory(categoryData, userInputs.parent, session)
                : await this.createRootCategory(categoryData, session)
        })
    }

    async findLeafs(): Promise<Category[]> {
        return this.categoryModel.find({ $expr: { $eq: ['$right', { $add: ['$left', 1] }] } })
            .sort({ view_count: -1 })
            .limit(30)
            .lean()
    }
}