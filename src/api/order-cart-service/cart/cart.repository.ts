import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Cart, CartDocument } from "./schemas/cart.schema";
import { Model, Types } from "mongoose";
import { SharedUtilsService } from "src/common/utils/shared-utils.service";
import { ProductRepository } from "src/api/product-service/product/product.repository";
import { FavoriteDocument } from "src/api/profile-service/favorite/schemas/favorite.schema";

@Injectable()
export class CartRepository {
    constructor(
        @InjectModel(Cart.name) private cartModel: Model<Cart>,
        private readonly sharedUtilsService: SharedUtilsService,
        private readonly productRepository: ProductRepository,
    ) { }

    async findExists(queryFields: Partial<Cart>): Promise<Pick<CartDocument, '_id'> | null> {
        return await this.cartModel.exists(queryFields)
    }

    async create(userInputs: Cart): Promise<void> {
        await this.sharedUtilsService.executeTransaction(async (session) => {
            await this.cartModel.create([userInputs], { session })
            await this.productRepository.findOneAndUpdateStatistic({ carts: 1 }, userInputs.product, session)
        })
    }

    async findById(cartId: Types.ObjectId): Promise<Cart | null> {
        return await this.cartModel.findById(cartId)
    }

    async findByIdAndDelete(cart: Pick<CartDocument, '_id' | 'product' | 'user'>): Promise<void> {
        await this.sharedUtilsService.executeTransaction(async (session) => {
            await this.cartModel.findByIdAndDelete(cart._id, { session })
            await this.productRepository.findOneAndUpdateStatistic({ carts: -1 }, cart.product, session)
        })
    }

    async find(queryFields: Partial<Cart>): Promise<Cart[]> {
        return await this.cartModel.find(queryFields).populate({
            path: 'product',
            select: 'name images price discount',
            populate: [
                { path: 'brand' },
                { path: 'category', select: 'name' },
                { path: 'company', select: 'name' },
            ]
        }).populate({
            path: 'product_stock',
            select: 'additional_price variations',
            populate: [
                { path: 'variations.variation' },
                { path: 'variations.options' }
            ]
        })
            .sort({ createdAt: -1 })
    }

    async deleteMany(queryFields: Partial<Cart>, productIds: Types.ObjectId[]): Promise<void> {
        await this.sharedUtilsService.executeTransaction(async (session) => {
            await this.cartModel.deleteMany(queryFields, { session })
            await this.productRepository.updateManyProductStatistic({ carts: -1 }, productIds, session)
        })
    }
}