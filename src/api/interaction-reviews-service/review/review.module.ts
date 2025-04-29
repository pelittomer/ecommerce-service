import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from './schemas/review.schema';
import { ReviewRepository } from './review.repository';
import { SharedUtilsModule } from 'src/common/utils/shared-utils.module';
import { ProductModule } from 'src/api/product-service/product/product.module';
import { OrderModule } from 'src/api/order-cart-service/order/order.module';
import { UploadModule } from 'src/api/upload-service/upload/upload.module';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService, ReviewRepository],
  imports: [
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
    SharedUtilsModule, ProductModule, OrderModule, UploadModule
  ]
})
export class ReviewModule { }
