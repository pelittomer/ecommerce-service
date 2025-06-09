import { Module } from '@nestjs/common';
import { CategoryService } from './service/category.service';
import { CategoryController } from './category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './entities/category.entity';
import { CategoryRepository } from './repository/category.repository';
import { SharedUtilsModule } from 'src/common/utils/shared-utils.module';
import { UploadModule } from 'src/api/upload-service/upload/upload.module';
import { CategoryUtilsService } from './utils/category-utils.service';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository, CategoryUtilsService],
  imports: [
    MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]),
    SharedUtilsModule, UploadModule
  ]
})
export class CategoryModule { }
