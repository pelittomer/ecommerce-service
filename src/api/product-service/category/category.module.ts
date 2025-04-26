import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './schemas/category.schema';
import { CategoryRepository } from './category.repository';
import { SharedUtilsModule } from 'src/common/utils/shared-utils.module';
import { UploadModule } from 'src/api/upload-service/upload/upload.module';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository],
  imports: [
    MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]),
    SharedUtilsModule, UploadModule
  ]
})
export class CategoryModule { }
