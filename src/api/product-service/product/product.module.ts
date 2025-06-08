import { Module } from '@nestjs/common';
import { ProductService } from './service/product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './entities/product.entity';
import { ProductDetail, ProductDetailSchema } from './entities/product-details.entity';
import { ProductStatistic, ProductStatisticSchema } from './entities/product-statistic.entity';
import { ProductStock, ProductStockSchema } from './entities/product-stock.entity';
import { ProductRepository } from './repository/product.repository';
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
  ],
  exports: [ProductRepository]
})
export class ProductModule { }
