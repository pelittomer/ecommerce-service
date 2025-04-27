import { Injectable } from '@nestjs/common';
import { VariationRepository } from './variation.repository';
import { CreateVariationDto } from './dto/create-variation.dto';

@Injectable()
export class VariationService {
    constructor(
        private readonly variationRepository: VariationRepository,
    ) { }

    async createVariation(userInputs: CreateVariationDto) {
        await this.variationRepository.create(userInputs)
        return 'Variation successfully created.'
    }

}
