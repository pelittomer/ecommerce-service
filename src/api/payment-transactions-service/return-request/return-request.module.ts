import { Module } from '@nestjs/common';
import { ReturnRequestService } from './return-request.service';
import { ReturnRequestController } from './return-request.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ReturnRequest, ReturnRequestSchema } from './schemas/return-request.schema';
import { ReturnRequestRepository } from './return-request.repository';

@Module({
  controllers: [ReturnRequestController],
  providers: [ReturnRequestService, ReturnRequestRepository],
  imports: [
    MongooseModule.forFeature([{ name: ReturnRequest.name, schema: ReturnRequestSchema }]),
  ]
})
export class ReturnRequestModule { }
