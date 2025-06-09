import { Injectable, NotFoundException } from "@nestjs/common";
import { CheckIfProductPurchasedParams, IReviewUtilsService } from "./review-utils.service.interface";
import { OrderRepository } from "src/api/order-cart-service/order/repository/order.repository";
import { ProductRepository } from "src/api/product-service/product/repository/product.repository";
import { Types } from "mongoose";
import { REVIEW_MESSAGE } from "../constants/review.message";

@Injectable()
export class ReviewUtilsService implements IReviewUtilsService {
    constructor(
        private readonly productRepository: ProductRepository,
        private readonly orderRepository: OrderRepository,
    ) { }

    async validateProductExistence(productId: Types.ObjectId): Promise<void> {
        const productExists = await this.productRepository.findById(productId)
        if (!productExists) {
            throw new NotFoundException(REVIEW_MESSAGE.PRODUCT_NOT_FOUND)
        }
    }

    async checkIfProductPurchased(params: CheckIfProductPurchasedParams): Promise<boolean> {
        const { productId, userId } = params
        const isPurchased = await this.orderRepository.findOneOrderItemExists({ user: userId, product: productId })
        return !!isPurchased
    }
}