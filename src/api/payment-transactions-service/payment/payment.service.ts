import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Types } from 'mongoose';
import { Request } from 'express';
import { PaymentRepository } from './payment.repository';
import { SharedUtilsService } from 'src/common/utils/shared-utils.service';
import { PaymentStatus } from 'src/common/types';

@Injectable()
export class PaymentService {
    constructor(
        private readonly paymentRepository: PaymentRepository,
        private readonly sharedUtilsService: SharedUtilsService,
    ) { }

    async updatePayment(userInputs: CreatePaymentDto, paymentId: Types.ObjectId, req: Request) {
        const user = this.sharedUtilsService.getUserInfo(req)
        const userId = new Types.ObjectId(user.userId)

        await this.paymentRepository.findOneAndUpdate(
            {
                ...userInputs,
                payment_status: PaymentStatus.Processing
            }
            ,
            { _id: paymentId, user: userId }
        )

        return 'Payment process completed successfully.'
    }

}
