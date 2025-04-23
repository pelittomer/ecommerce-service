import { Module } from '@nestjs/common';
import { VariationService } from './variation.service';
import { VariationController } from './variation.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Variation, VariationSchema } from './schemas/variation.schema';
import { VariationOption, VariationOptionSchema } from './schemas/variation-option.schema';
import { VariationRepository } from './variation.repository';

@Module({
  controllers: [VariationController],
  providers: [VariationService, VariationRepository],
  imports: [
    MongooseModule.forFeature([{ name: Variation.name, schema: VariationSchema }]),
    MongooseModule.forFeature([{ name: VariationOption.name, schema: VariationOptionSchema }]),
  ]
})
export class VariationModule { }
