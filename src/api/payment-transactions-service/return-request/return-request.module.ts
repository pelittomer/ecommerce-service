import { Module } from '@nestjs/common';
import { ReturnRequestService } from './service/return-request.service';
import { ReturnRequestController } from './return-request.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ReturnRequest, ReturnRequestSchema } from './entities/return-request.entity';
import { ReturnRequestRepository } from './repository/return-request.repository';
import { SharedUtilsModule } from 'src/common/utils/shared-utils.module';
import { OrderModule } from 'src/api/order-cart-service/order/order.module';
import { ReturnRequestUtilsService } from './utils/return-request-utils.service';

@Module({
  controllers: [ReturnRequestController],
  providers: [ReturnRequestService, ReturnRequestRepository, ReturnRequestUtilsService],
  imports: [
    MongooseModule.forFeature([{ name: ReturnRequest.name, schema: ReturnRequestSchema }]),
    SharedUtilsModule, OrderModule
  ]
})
export class ReturnRequestModule { }
