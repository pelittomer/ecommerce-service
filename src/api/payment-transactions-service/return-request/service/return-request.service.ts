import { Injectable } from '@nestjs/common';
import { ReturnRequestRepository } from '../repository/return-request.repository';
import { SharedUtilsService } from 'src/common/utils/shared-utils.service';
import { randomBytes } from 'crypto';
import { ReturnRequestUtilsService } from '../utils/return-request-utils.service';
import { RETURN_REQUEST_MESSAGE } from '../constants/return-request.message';
import { CreateReturnRequestParams } from './return-request.service.interface';

@Injectable()
export class ReturnRequestService {
    constructor(
        private readonly returnRequestRepository: ReturnRequestRepository,
        private readonly sharedUtilsService: SharedUtilsService,
        private readonly returnRequestUtilsService: ReturnRequestUtilsService,
    ) { }

    async createReturnRequest(params: CreateReturnRequestParams): Promise<string> {
        const { req, payload } = params
        const user = this.sharedUtilsService.getUserIdFromRequest(req)

        await this.returnRequestUtilsService.validateOrderItem({ userId: user, orderItemId: payload.orderItem })

        const returnCode = randomBytes(32).toString('hex')
        await this.returnRequestRepository.create({ ...payload, user, returnCode })

        return RETURN_REQUEST_MESSAGE.RETURN_REQUEST_CREATED_SUCCESS
    }
}
