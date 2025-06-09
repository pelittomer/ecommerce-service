import { Injectable } from '@nestjs/common';
import { CartRepository } from '../repository/cart.repository';
import { Request } from 'express';
import { SharedUtilsService } from 'src/common/utils/shared-utils.service';
import { Types } from 'mongoose';
import { Cart } from '../entities/cart.entity';
import { CartUtilsService } from '../utils/cart-utils.service';
import { CART_MESSAGE } from '../constants/cart.message';
import { CreateCartParams, ICartService, RemoveCartParams, UpdateCartParams } from './cart.service.interface';

@Injectable()
export class CartService implements ICartService {
    constructor(
        private readonly cartRepository: CartRepository,
        private readonly sharedUtilsService: SharedUtilsService,
        private readonly cartUtilsService: CartUtilsService,
    ) { }

    async createCart(params: CreateCartParams): Promise<string> {
        const { payload, req } = params
        const { product, product_stock, quantity } = payload
        const userId = this.sharedUtilsService.getUserIdFromRequest(req)
        const productObjectId = new Types.ObjectId(product)

        await Promise.all([
            this.cartUtilsService.validateProductExistence(product),
            this.cartUtilsService.validateProductNotInCart({ userId, productId: productObjectId }),
        ])
        await this.cartUtilsService.validateProductStock({ productStockId: product_stock, requestedQuantity: quantity })

        await this.cartRepository.create({
            quantity,
            product: productObjectId,
            product_stock,
            user: userId
        })

        return CART_MESSAGE.PRODUCT_ADDED_SUCCESS
    }

    async removeCart(params: RemoveCartParams): Promise<string> {
        const { cartId, req } = params
        const userId = this.sharedUtilsService.getUserIdFromRequest(req)

        const cartItemToDelete = await this.cartUtilsService.getAndValidateCartItem({ cartId, userId })
        await this.cartRepository.findByIdAndDelete({ _id: cartId, user: userId, product: cartItemToDelete.product })

        return CART_MESSAGE.CART_ITEM_REMOVED_SUCCESS
    }

    async findCarts(req: Request): Promise<Cart[]> {
        const user = this.sharedUtilsService.getUserIdFromRequest(req)
        return await this.cartRepository.find({ user })
    }

    async removeCarts(req: Request): Promise<string> {
        const userId = this.sharedUtilsService.getUserIdFromRequest(req)

        const carts = await this.cartRepository.find({ user: userId })
        const productIds = carts.map((item) => item.product._id)

        await this.cartRepository.deleteMany({ queryFields: { user: userId }, productIds })

        return CART_MESSAGE.ALL_PRODUCTS_REMOVED_SUCCESS
    }

    async updateCart(params: UpdateCartParams): Promise<string> {
        const { cartId, payload, req } = params
        const { quantity } = payload
        const userId = this.sharedUtilsService.getUserIdFromRequest(req)

        const cartItem = await this.cartUtilsService.getAndValidateCartItemOwnership({ cartId, userId })
        await this.cartUtilsService.validateProductStock({ productStockId: cartItem.product_stock, requestedQuantity: quantity })
        await this.cartRepository.findByIdAndUpdate({ cartId, queryFields: { quantity } })

        return CART_MESSAGE.CART_ITEM_UPDATED_SUCCESS
    }
}
