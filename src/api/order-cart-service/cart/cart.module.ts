import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './schemas/cart.schema';
import { CartRepository } from './cart.repository';
import { ProductModule } from 'src/api/product-service/product/product.module';
import { SharedUtilsModule } from 'src/common/utils/shared-utils.module';

@Module({
  controllers: [CartController],
  providers: [CartService, CartRepository],
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    ProductModule, SharedUtilsModule
  ],
  exports: [CartRepository]
})
export class CartModule { }
