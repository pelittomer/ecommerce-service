import { Injectable } from '@nestjs/common';
import { BrandRepository } from '../repository/brand.repository';
import { Brand } from '../entities/brand.entity';
import { CreateBrandParams, IBrandService } from './brand.service.interface';
import { BrandUtilsService } from '../utils/brand-utils.service';
import { BRAND_MESSAGE } from '../constants/brand.message';

@Injectable()
export class BrandService implements IBrandService {
    constructor(
        private readonly brandRepository: BrandRepository,
        private readonly brandUtilsService: BrandUtilsService,
    ) { }

    async createBrand(params: CreateBrandParams): Promise<string> {
        const { payload, uploadedImage } = params

        this.brandUtilsService.validateImage(uploadedImage)
        await this.brandUtilsService.validateBrandNameUniqueness(payload.name)
        await this.brandRepository.create({ payload, uploadedImage })

        return BRAND_MESSAGE.BRAND_CREATED_SUCCESS
    }

    async findBrands(): Promise<Brand[]> {
        return await this.brandRepository.find()
    }

}
