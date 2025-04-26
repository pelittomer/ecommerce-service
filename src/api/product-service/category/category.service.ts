import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryRepository } from './category.repository';

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
}
