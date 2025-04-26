import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Brand, BrandSchema } from './schemas/brand.schema';
import { BrandRepository } from './brand.repository';
import { SharedUtilsModule } from 'src/common/utils/shared-utils.module';
import { UploadModule } from 'src/api/upload-service/upload/upload.module';

@Module({
  controllers: [BrandController],
  providers: [BrandService, BrandRepository],
  imports: [
    MongooseModule.forFeature([{ name: Brand.name, schema: BrandSchema }]),
    SharedUtilsModule, UploadModule
  ]
})
export class BrandModule { }
