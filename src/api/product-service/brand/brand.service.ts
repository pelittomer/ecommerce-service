import { BadRequestException, Injectable } from '@nestjs/common';
import { BrandRepository } from './brand.repository';
import { CreateBrandDto } from './dto/create-brand.dto';

@Injectable()
export class BrandService {
    constructor(
        private readonly brandRepository: BrandRepository
    ) { }

    async createBrand(userInputs: CreateBrandDto, uploadedImage: Express.Multer.File) {
        if (!uploadedImage) {
            throw new BadRequestException('No image was uploaded. Please ensure you provide a valid image file.Image not found.')
        }

        const brandExists = await this.brandRepository.findExits({ name: userInputs.name })
        if (brandExists) {
            throw new BadRequestException('This brand name is already in use. Please use another brand name.')
        }

        await this.brandRepository.create(userInputs, uploadedImage)

        return 'Brand successfully created.'
    }


}
