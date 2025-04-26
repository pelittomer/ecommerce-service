import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryRepository } from './category.repository';
import { Category } from './schemas/category.schema';
import { Types } from 'mongoose';

@Injectable()
export class CategoryService {
    constructor(
        private readonly categoryRepository: CategoryRepository
    ) { }

    async createCategory(userInputs: CreateCategoryDto, uploadedImage: { image: Express.Multer.File[], icon: Express.Multer.File[] }) {
        if (!uploadedImage.icon || !uploadedImage.image) {
            throw new BadRequestException('No image was uploaded. Please ensure you provide a valid image file.')
        }

        await this.categoryRepository.create(userInputs, uploadedImage)

        return 'Category successfully created.'
    }

    async findLeafs(): Promise<Category[]> {
        return await this.categoryRepository.findLeafs()
    }

    async findRoots(): Promise<Category[]> {
        return await this.categoryRepository.findRoots()
    }

    async findTree(categoryId?: Types.ObjectId) {
        if (!categoryId) {
            return await this.categoryRepository.findRoots()
        }
        return await this.categoryRepository.findTree(categoryId)
    }
}
