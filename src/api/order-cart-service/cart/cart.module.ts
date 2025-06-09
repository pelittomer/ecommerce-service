import { Module } from '@nestjs/common';
import { CartService } from './service/cart.service';
import { CartController } from './cart.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './entities/cart.entity';
import { CartRepository } from './repository/cart.repository';
import { ProductModule } from 'src/api/product-service/product/product.module';
import { SharedUtilsModule } from 'src/common/utils/shared-utils.module';
import { CartUtilsService } from './utils/cart-utils.service';

@Module({
  controllers: [CartController],
  providers: [CartService, CartRepository, CartUtilsService],
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    ProductModule, SharedUtilsModule
  ],
  exports: [CartRepository]
})
export class CartModule { }
