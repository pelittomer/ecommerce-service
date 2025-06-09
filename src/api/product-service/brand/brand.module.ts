import { Module } from '@nestjs/common';
import { BrandService } from './service/brand.service';
import { BrandController } from './brand.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Brand, BrandSchema } from './entities/brand.entity';
import { BrandRepository } from './repository/brand.repository';
import { SharedUtilsModule } from 'src/common/utils/shared-utils.module';
import { UploadModule } from 'src/api/upload-service/upload/upload.module';
import { BrandUtilsService } from './utils/brand-utils.service';

@Module({
  controllers: [BrandController],
  providers: [BrandService, BrandRepository, BrandUtilsService],
  imports: [
    MongooseModule.forFeature([{ name: Brand.name, schema: BrandSchema }]),
    SharedUtilsModule, UploadModule
  ]
})
export class BrandModule { }
