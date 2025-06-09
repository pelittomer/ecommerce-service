import { Injectable, NotFoundException } from "@nestjs/common";
import { OrderRepository } from "src/api/order-cart-service/order/order.repository";
import { RETURN_REQUEST_MESSAGE } from "../constants/return-request.message";
import { IReturnRequestUtilsService, ValidateOrderItemParams } from "./return-request-utils.service.interface";

@Injectable()
export class ReturnRequestUtilsService implements IReturnRequestUtilsService {
    constructor(
        private readonly orderRepository: OrderRepository,
    ) { }

    async validateOrderItem(params: ValidateOrderItemParams): Promise<void> {
        const { orderItemId, userId } = params
        const orderItem = await this.orderRepository.findOneOrderItem({ user: userId, _id: orderItemId })
        if (!orderItem) {
            throw new NotFoundException(RETURN_REQUEST_MESSAGE.ORDER_ITEM_NOT_FOUND)
        }
    }
}