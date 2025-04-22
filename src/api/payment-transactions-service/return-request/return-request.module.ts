import { Module } from '@nestjs/common';
import { ReturnRequestService } from './return-request.service';
import { ReturnRequestController } from './return-request.controller';

@Module({
  controllers: [ReturnRequestController],
  providers: [ReturnRequestService],
})
export class ReturnRequestModule {}
