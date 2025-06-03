import { Injectable, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { OrderRepository } from './order.repository';
import { SharedUtilsService } from 'src/common/utils/shared-utils.service';
import { Types } from 'mongoose';
import { CartRepository } from '../cart/cart.repository';
import { AddressRepository } from 'src/api/profile-service/address/repository/address.repository';
import { OrderUtilsService } from './utils/order-utils.service';
import { Order } from './schemas/order.schema';
import { OrderItem } from './schemas/order-item.schema';

@Injectable()
export class OrderService {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly cartRepository: CartRepository,
        private readonly addressRepository: AddressRepository,
        private readonly sharedUtilsService: SharedUtilsService,
        private readonly orderUtilsService: OrderUtilsService,
    ) { }

    async createOrder(req: Request): Promise<string> {
        const user = this.sharedUtilsService.getUserInfo(req)
        const userId = new Types.ObjectId(user.userId)
        // Fetch the user's purchasable cart items
        const carts = await this.cartRepository.findIsPurschable({ user: userId, is_purchasable: true })

        if (!carts || carts.length === 0) {
            throw new NotFoundException('Cart empty.')
        }
        // Fetch the user's default address
        const defaultAddress = await this.addressRepository.findIsDefault({ user: userId, is_default: true })
        if (!defaultAddress) {
            throw new NotFoundException('Add an address.')
        }

        // Calculate the total amount of the order
        const totalAmount = this.orderUtilsService.calculateTotalAmount(carts)

        await this.orderRepository.create(carts, defaultAddress, totalAmount, userId)

        return 'Order successfully created.'
    }

    async findOrders(req: Request): Promise<Order[]> {
        const user = this.sharedUtilsService.getUserInfo(req)
        return await this.orderRepository.find({ user: new Types.ObjectId(user.userId) })
    }

    async findOrderDetails(orderId: Types.ObjectId, req: Request): Promise<OrderItem[]> {
        const user = this.sharedUtilsService.getUserInfo(req)
        return await this.orderRepository.findOrderItem({
            user: new Types.ObjectId(user.userId),
            order: orderId
        })
    }
}
