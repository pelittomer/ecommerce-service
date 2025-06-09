import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { CartRepository } from "../repository/cart.repository";
import { ProductRepository } from "src/api/product-service/product/repository/product.repository";
import { CART_MESSAGE } from "../constants/cart.message";
import { Types } from "mongoose";
import { ProductStock } from "src/api/product-service/product/entities/product-stock.entity";
import { Cart } from "../entities/cart.entity";
import { GetAndValidateCartItemOwnershipParams, GetAndValidateCartItemParams, ICartUtilsService, ValidateProductNotInCartParams, ValidateProductStockParams } from "./cart-utils.service.interface";


@Injectable()
export class CartUtilsService implements ICartUtilsService {
    constructor(
        private readonly cartRepository: CartRepository,
        private readonly productRepository: ProductRepository,
    ) { }

    async validateProductExistence(productId: Types.ObjectId): Promise<void> {
        const productExists = await this.productRepository.findProductExists({ _id: productId });
        if (!productExists) {
            throw new NotFoundException(CART_MESSAGE.PRODUCT_NOT_FOUND);
        }
    }

    async validateProductNotInCart(params: ValidateProductNotInCartParams): Promise<void> {
        const { productId, userId } = params
        const cartExists = await this.cartRepository.findExists({ product: productId, user: userId });
        if (cartExists) {
            throw new ConflictException(CART_MESSAGE.PRODUCT_ALREADY_IN_CART);
        }
    }

    async validateProductStock(params: ValidateProductStockParams): Promise<ProductStock> {
        const { productStockId, requestedQuantity } = params
        const stockExists = await this.productRepository.findStockItemById(productStockId);
        if (!stockExists || stockExists.stock_quantity < requestedQuantity) {
            throw new BadRequestException(CART_MESSAGE.NOT_ENOUGH_STOCK);
        }
        return stockExists
    }

    async getAndValidateCartItem(params: GetAndValidateCartItemParams): Promise<Cart> {
        const { cartId, userId } = params
        const cartItem = await this.cartRepository.findById(cartId)

        if (!cartItem || !cartItem.user._id.equals(userId)) {
            throw new NotFoundException(CART_MESSAGE.PRODUCT_NOT_FOUND)
        }
        return cartItem
    }

    async getAndValidateCartItemOwnership(params: GetAndValidateCartItemOwnershipParams): Promise<Cart> {
        const { cartId, userId } = params
        const cartItem = await this.cartRepository.findById(cartId)

        if (!cartItem) {
            throw new NotFoundException(CART_MESSAGE.PRODUCT_NOT_FOUND_IN_CART)
        }

        if (!cartItem.user._id.equals(userId)) {
            throw new ForbiddenException(CART_MESSAGE.PRODUCT_NOT_FOUND_IN_CART)
        }
        return cartItem
    }


}