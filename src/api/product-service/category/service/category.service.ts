import { BadRequestException, Injectable } from '@nestjs/common';
import { CategoryRepository } from '../repository/category.repository';
import { Category } from '../entities/category.entity';
import { Types } from 'mongoose';
import { CreateCategoryProps, ICategoryService } from './category.service.interface';
import { CATEGORY_MESSAGE } from '../constants/category.message';

@Injectable()
export class CategoryService implements ICategoryService {
    constructor(
        private readonly categoryRepository: CategoryRepository
    ) { }

    async createCategory(params: CreateCategoryProps): Promise<string> {
        const { payload, uploadedImage } = params
        if (!uploadedImage.icon || !uploadedImage.image) {
            throw new BadRequestException(CATEGORY_MESSAGE.NO_IMAGE_UPLOADED)
        }

        await this.categoryRepository.create({ payload, uploadedImage })

        return CATEGORY_MESSAGE.CATEGORY_CREATED_SUCCESS
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
