import { Injectable, NotFoundException } from '@nestjs/common';
import { ReturnRequestRepository } from './return-request.repository';
import { CreateReturnRequestDto } from './dto/create-return-request.dto';
import { Request } from 'express';
import { OrderRepository } from 'src/api/order-cart-service/order/order.repository';
import { SharedUtilsService } from 'src/common/utils/shared-utils.service';
import { Types } from 'mongoose';
import { randomBytes } from 'crypto';

@Injectable()
export class ReturnRequestService {
    constructor(
        private readonly returnRequestRepository: ReturnRequestRepository,
        private readonly orderRepository: OrderRepository,
        private readonly sharedUtilsService: SharedUtilsService,
    ) { }

    async createReturnRequest(userInputs: CreateReturnRequestDto, req: Request): Promise<string> {
        const user = this.sharedUtilsService.getUserInfo(req)
        const userId = new Types.ObjectId(user.userId)

        const orderItemExists = await this.orderRepository.findOneOrderItem({ user: userId, _id: userInputs.orderItem })
        if (!orderItemExists) {
            throw new NotFoundException('Order item not found!')
        }

        const returnCode = randomBytes(32).toString('hex')

        await this.returnRequestRepository.create({ ...userInputs, user: userId, returnCode })

        return 'Return request initiated successfully.'
    }
}
