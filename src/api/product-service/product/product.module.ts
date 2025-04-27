import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas/product.schema';
import { ProductDetail, ProductDetailSchema } from './schemas/product-details.schema';
import { ProductStatistic, ProductStatisticSchema } from './schemas/product-statistic.schema';
import { ProductStock, ProductStockSchema } from './schemas/product-stock.schema';
import { ProductRepository } from './product.repository';
import { ProductUtilsService } from './utils/product-utils.service';
import { UploadModule } from 'src/api/upload-service/upload/upload.module';
import { SharedUtilsModule } from 'src/common/utils/shared-utils.module';
import { CompanyModule } from 'src/api/company-service/company/company.module';

@Module({
  controllers: [ProductController],
  providers: [ProductService, ProductRepository, ProductUtilsService],
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: ProductDetail.name, schema: ProductDetailSchema }]),
    MongooseModule.forFeature([{ name: ProductStatistic.name, schema: ProductStatisticSchema }]),
    MongooseModule.forFeature([{ name: ProductStock.name, schema: ProductStockSchema }]),
    UploadModule, SharedUtilsModule, CompanyModule
  ]
})
export class ProductModule { }
