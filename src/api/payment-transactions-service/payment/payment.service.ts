import { Injectable, Logger } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Types } from 'mongoose';
import { Request } from 'express';
import { PaymentRepository } from './payment.repository';
import { SharedUtilsService } from 'src/common/utils/shared-utils.service';
import { PaymentStatus } from 'src/common/types';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class PaymentService {
    private readonly logger = new Logger(PaymentService.name)

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

    @Cron(CronExpression.EVERY_MINUTE)
    async paymentProccess() {
        try {
            const processingPayments = await this.paymentRepository.find({ payment_status: PaymentStatus.Processing })

            if (processingPayments.length === 0) {
                return
            }

            const statusOptions = [PaymentStatus.Completed, PaymentStatus.Failed]

            const bulkOperations = processingPayments.map((payment) => {
                const randomIndex = Math.floor(Math.random() * statusOptions.length)
                const newPaymentStatus = statusOptions[randomIndex]

                return {
                    updateOne: {
                        filter: { _id: payment._id },
                        update: { $set: { payment_status: newPaymentStatus } },
                    },
                }
            })

            const result = await this.paymentRepository.bulkWrite(bulkOperations)
            this.logger.log(`Payment process completed. ${result?.modifiedCount || 0} payments updated.`)
        } catch (error) {
            this.logger.error('Payment schedule error (bulk operation): ', error)
        }
    }
}
