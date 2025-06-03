import { Module } from '@nestjs/common';
import { VariationService } from './service/variation.service';
import { VariationController } from './variation.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Variation, VariationSchema } from './entities/variation.entity';
import { VariationOption, VariationOptionSchema } from './entities/variation-option.entity';
import { VariationRepository } from './repository/variation.repository';
import { SharedUtilsModule } from 'src/common/utils/shared-utils.module';

@Module({
  controllers: [VariationController],
  providers: [VariationService, VariationRepository],
  imports: [
    MongooseModule.forFeature([{ name: Variation.name, schema: VariationSchema }]),
    MongooseModule.forFeature([{ name: VariationOption.name, schema: VariationOptionSchema }]),
    SharedUtilsModule
  ]
})
export class VariationModule { }
