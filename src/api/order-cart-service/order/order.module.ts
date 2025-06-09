import { Module } from '@nestjs/common';
import { OrderService } from './service/order.service';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './entities/order.entity';
import { OrderItem, OrderItemSchema } from './entities/order-item.entity';
import { OrderRepository } from './repository/order.repository';
import { OrderUtilsService } from './utils/order-utils.service';
import { CartModule } from '../cart/cart.module';
import { AddressModule } from 'src/api/profile-service/address/address.module';
import { SharedUtilsModule } from 'src/common/utils/shared-utils.module';
import { ProductModule } from 'src/api/product-service/product/product.module';
import { PaymentModule } from 'src/api/payment-transactions-service/payment/payment.module';

@Module({
  controllers: [OrderController],
  providers: [OrderService, OrderRepository, OrderUtilsService],
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    MongooseModule.forFeature([{ name: OrderItem.name, schema: OrderItemSchema }]),
    CartModule, AddressModule, SharedUtilsModule, ProductModule, PaymentModule
  ],
  exports: [OrderRepository]
})
export class OrderModule { }
