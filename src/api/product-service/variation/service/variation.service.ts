import { Injectable } from '@nestjs/common';
import { VariationRepository } from '../repository/variation.repository';
import { CreateVariationDto } from '../dto/create-variation.dto';
import { Types } from 'mongoose';
import { IVariationService } from './variation.service.interface';
import { VARIATION_MESSAGE } from '../constants/variation.message';

@Injectable()
export class VariationService implements IVariationService {
    constructor(
        private readonly variationRepository: VariationRepository,
    ) { }

    async createVariation(payload: CreateVariationDto): Promise<string> {
        await this.variationRepository.create(payload)
        return VARIATION_MESSAGE.VARIATION_CREATED_SUCCESS
    }
    //refactor(any type)
    async findVariation(categoryId: Types.ObjectId): Promise<any> {
        return this.variationRepository.find(categoryId)
    }
}
