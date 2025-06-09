import { BadRequestException, Injectable } from "@nestjs/common";
import { BrandRepository } from "../repository/brand.repository";
import { BRAND_MESSAGE } from "../constants/brand.message";
import { IBrandUtilsService } from "./brand.utils.service.interface";

@Injectable()
export class BrandUtilsService implements IBrandUtilsService {
    constructor(
        private readonly brandRepository: BrandRepository,
    ) { }

    async validateBrandNameUniqueness(brandName: string): Promise<void> {
        const brandExists = await this.brandRepository.findExits({ name: brandName });
        if (brandExists) {
            throw new BadRequestException(BRAND_MESSAGE.BRAND_NAME_ALREADY_IN_USE)
        }
    }
    
    validateImage(uploadedImage: Express.Multer.File): void {
        if (!uploadedImage) {
            throw new BadRequestException(BRAND_MESSAGE.NO_IMAGE_UPLOADED)
        }
    }
}