import { Injectable, NotFoundException } from "@nestjs/common";
import { CartRepository, PopulateCart } from "../../cart/cart.repository";
import { ORDER_MESSAGE } from "../constants/order.message";
import { Types } from "mongoose";
import { AddressDocument } from "src/api/profile-service/address/entities/types";
import { AddressRepository } from "src/api/profile-service/address/repository/address.repository";
import { IOrderUtilsService } from "./order-utils.service.interface";

@Injectable()
export class OrderUtilsService implements IOrderUtilsService {
    constructor(
        private readonly cartRepository: CartRepository,
        private readonly addressRepository: AddressRepository,
    ) { }

    calculateTotalAmount(carts: PopulateCart[]): number {
        return carts.reduce((total, item) => {
            let itemPrice: number
            // Calculate item price based on discount type
            if (item.product.discount && item.product.discount.applied_price) {
                itemPrice = (item.product.price - item.product.discount.applied_price + item.product_stock.additional_price)
            } else if (item.product.discount && item.product.discount.discount_percentage) {
                itemPrice = item.product.price * (1 - (item.product.discount.discount_percentage / 100))
            } else {
                itemPrice = item.product.price
            }

            return total + itemPrice * item.quantity
        }, 0)
    }

    calculateItemPrice(item: PopulateCart): number {
        if (item.product.discount && item.product.discount.applied_price) {
            return item.product.price - item.product.discount.applied_price + item.product_stock.additional_price
        }
        if (item.product.discount && item.product.discount.discount_percentage) {
            return item.product.price * (1 - item.product.discount.discount_percentage / 100)
        }
        return item.product.price
    }

    async getAndValidatePurchasableCarts(userId: Types.ObjectId): Promise<PopulateCart[]> {
        const carts = await this.cartRepository.findIsPurschable({ user: userId, is_purchasable: true })

        if (!carts || carts.length === 0) {
            throw new NotFoundException(ORDER_MESSAGE.CART_EMPTY)
        }
        return carts
    }

    async getAndValidateDefaultAddress(userId: Types.ObjectId): Promise<Pick<AddressDocument, '_id'>> {
        const defaultAddress = await this.addressRepository.findIsDefault({ user: userId, is_default: true })

        if (!defaultAddress) {
            throw new NotFoundException(ORDER_MESSAGE.NO_DEFAULT_ADDRESS)
        }
        return defaultAddress
    }
}