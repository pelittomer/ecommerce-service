import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Cart, CartDocument } from "./schemas/cart.schema";
import { ClientSession, Model, Types } from "mongoose";
import { SharedUtilsService } from "src/common/utils/shared-utils.service";
import { ProductRepository } from "src/api/product-service/product/repository/product.repository";
import { ProductDocument, ProductStockDocument } from "src/api/product-service/product/entities/types";

export type PopulatedProduct = Pick<ProductDocument, '_id' | 'price' | 'discount'>
export type PopulatedProductStock = Pick<ProductStockDocument, '_id' | 'additional_price' | 'is_limited' | 'auto_replenish' | 'replenish_quantity' | 'stock_quantity'>

export type PopulateCart = Omit<Cart, 'product' | 'product_stock'> & {
    product: PopulatedProduct;
    product_stock: PopulatedProductStock;
}

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
            await this.productRepository.findOneAndUpdateStatistic({
                query: { carts: 1 },
                productId: userInputs.product, session
            })
        })
    }

    async findById(cartId: Types.ObjectId): Promise<Cart | null> {
        return await this.cartModel.findById(cartId)
    }

    async findByIdAndDelete(cart: Pick<CartDocument, '_id' | 'product' | 'user'>): Promise<void> {
        await this.sharedUtilsService.executeTransaction(async (session) => {
            await this.cartModel.findByIdAndDelete(cart._id, { session })
            await this.productRepository.findOneAndUpdateStatistic({
                query: { carts: -1 },
                productId: cart.product, session
            })
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
            await this.productRepository.updateManyProductStatistic({
                query: { carts: -1 },
                productIds, session
            })
        })
    }

    async findByIdAndUpdate(cartId: Types.ObjectId, queryFields: Partial<Cart>): Promise<void> {
        await this.cartModel.findByIdAndUpdate(cartId, queryFields)
    }

    async findIsPurschable(queryFields: Partial<Cart>): Promise<PopulateCart[]> {
        return await this.cartModel.find(queryFields)
            .populate<{ product: PopulatedProduct }>({
                path: 'product',
                select: 'price discount'
            })
            .populate<{ product_stock: PopulatedProductStock }>({
                path: 'product_stock',
                select: 'additional_price is_limited auto_replenish stock_quantity'
            })
    }

    async updateBulkWrite(queryFields: any, session: ClientSession) {
        await this.cartModel.bulkWrite(queryFields, { session })
    }

    async deletePurchasableProducts(queryFieds: Pick<Cart, 'user' | 'is_purchasable'>, session: ClientSession): Promise<void> {
        await this.cartModel.deleteMany(queryFieds, { session })
    }
}