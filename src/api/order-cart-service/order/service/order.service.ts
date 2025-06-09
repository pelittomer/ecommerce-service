import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { OrderRepository } from '../repository/order.repository';
import { SharedUtilsService } from 'src/common/utils/shared-utils.service';
import { Types } from 'mongoose';
import { OrderUtilsService } from '../utils/order-utils.service';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { FindOrderDetailsParams, IOrderService } from './order.service.interface';
import { ORDER_MESSAGE } from '../constants/order.message';

@Injectable()
export class OrderService implements IOrderService {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly sharedUtilsService: SharedUtilsService,
        private readonly orderUtilsService: OrderUtilsService,
    ) { }

    async createOrder(req: Request): Promise<string> {
        const userId = this.sharedUtilsService.getUserIdFromRequest(req)

        const carts = await this.orderUtilsService.getAndValidatePurchasableCarts(userId)
        const defaultAddress = await this.orderUtilsService.getAndValidateDefaultAddress(userId)
        const totalAmount = this.orderUtilsService.calculateTotalAmount(carts)
        await this.orderRepository.create({ carts, defaultAddress, totalAmount, userId })

        return ORDER_MESSAGE.ORDER_CREATED_SUCCESS
    }

    async findOrders(req: Request): Promise<Order[]> {
        const user = this.sharedUtilsService.getUserIdFromRequest(req)
        return await this.orderRepository.find({ user })
    }

    async findOrderDetails(params: FindOrderDetailsParams): Promise<OrderItem[]> {
        const { orderId, req } = params
        const user = this.sharedUtilsService.getUserIdFromRequest(req)
        return await this.orderRepository.findOrderItem({
            user,
            order: orderId
        })
    }
}
