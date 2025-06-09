import { BadRequestException, Injectable } from '@nestjs/common';
import { CategoryRepository } from '../repository/category.repository';
import { Category } from '../schemas/category.schema';
import { Types } from 'mongoose';
import { CreateCategoryProps, ICategoryService } from './category.service.interface';

@Injectable()
export class CategoryService implements ICategoryService {
    constructor(
        private readonly categoryRepository: CategoryRepository
    ) { }

    async createCategory(params: CreateCategoryProps): Promise<string> {
        const { payload, uploadedImage } = params
        if (!uploadedImage.icon || !uploadedImage.image) {
            throw new BadRequestException('No image was uploaded. Please ensure you provide a valid image file.')
        }

        await this.categoryRepository.create({ payload, uploadedImage })

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
