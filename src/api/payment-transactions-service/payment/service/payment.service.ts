import { Injectable, Logger } from '@nestjs/common';
import { PaymentRepository } from '../repository/payment.repository';
import { SharedUtilsService } from 'src/common/utils/shared-utils.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { IPaymentService, UpdatePaymentParams } from './payment.service.interface';
import { PaymentStatus } from '../entities/types';
import { PAYMENT_MESSAGE } from '../constants/payment.message';

@Injectable()
export class PaymentService implements IPaymentService {
    private readonly logger = new Logger(PaymentService.name)

    constructor(
        private readonly paymentRepository: PaymentRepository,
        private readonly sharedUtilsService: SharedUtilsService,
    ) { }

    async updatePayment(params: UpdatePaymentParams): Promise<string> {
        const { payload, paymentId, req } = params
        const userId = this.sharedUtilsService.getUserIdFromRequest(req)

        await this.paymentRepository.findOneAndUpdate({
            payload: {
                ...payload,
                payment_status: PaymentStatus.Processing
            }
            ,
            queryFields: { _id: paymentId, user: userId }
        })

        return PAYMENT_MESSAGE.PAYMENT_SUCCESS
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
