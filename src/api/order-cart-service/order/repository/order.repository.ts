import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Order } from "../entities/order.entity";
import { Model, Types } from "mongoose";
import { OrderItem } from "../entities/order-item.entity";
import { OrderUtilsService } from "../utils/order-utils.service";
import { ProductRepository } from "src/api/product-service/product/repository/product.repository";
import { CartRepository } from "../../cart/repository/cart.repository";
import { SharedUtilsService } from "src/common/utils/shared-utils.service";
import { PaymentRepository } from "src/api/payment-transactions-service/payment/repository/payment.repository";
import { OrderDocument } from "../entities/types";
import { CreateOrderParams, FindOneOrderItemParams, FindOrderItemParams, IOrderRepository } from "./order.repository.interface";

@Injectable()
export class OrderRepository implements IOrderRepository {
    constructor(
        @InjectModel(Order.name) private orderModel: Model<Order>,
        @InjectModel(OrderItem.name) private orderItemModel: Model<OrderItem>,
        private readonly orderUtilsService: OrderUtilsService,
        private readonly sharedUtilsService: SharedUtilsService,
        private readonly cartRepository: CartRepository,
        private readonly productRepository: ProductRepository,
        private readonly paymentRepository: PaymentRepository,
    ) { }

    async findOneOrderItemExists(queryFields: Partial<OrderItem>): Promise<Pick<OrderDocument, '_id'> | null> {
        return await this.orderItemModel.exists(queryFields)
    }

    async create(params: CreateOrderParams): Promise<void> {
        const { carts, defaultAddress, totalAmount, userId } = params
        this.sharedUtilsService.executeTransaction(async (session) => {
            // Create a new order
            const [newOrder] = await this.orderModel.create([{
                address: defaultAddress._id,
                total_amount: totalAmount,
                user: userId,
            }], { session })


            // Create order items from cart items
            const orderItems = carts.map((item) => ({
                price: this.orderUtilsService.calculateItemPrice(item),
                quantity: item.quantity,
                product: item.product._id,
                product_stock: item.product_stock._id,
                order: newOrder._id,
                user: userId,
            }))
            // Insert the order items
            await this.orderItemModel.insertMany(orderItems, { session })

            //create payment
            await this.paymentRepository.create({
                payload: {
                    user: userId,
                    order: newOrder._id,
                    amount: totalAmount
                },
                session
            })

            //send to queue
            const productIds = carts.map((item) => item.product._id as Types.ObjectId)
            await this.productRepository.updateManyProductStatistic({
                query: { purchases: 1, carts: -1 },
                productIds,
                session
            })

            // Update product stock quantities
            const productStockUpdates = carts.map((item) => {
                const { quantity, product, product_stock } = item
                let update: any = {}

                if (
                    !product_stock.is_limited &&
                    product_stock.auto_replenish &&
                    product_stock.stock_quantity - quantity === 0
                ) {
                    update.stock_quantity = product_stock.replenish_quantity
                } else {
                    update.$inc = { stock_quantity: -quantity }
                }
                return {
                    updateOne: {
                        filter: { product: product._id, _id: product_stock._id },
                        update: update,
                    }
                }
            })

            const updatedStocksResult = await this.productRepository.bulkUpdateStocks({
                queryFields: productStockUpdates, session
            })
            const updatedStockCount = updatedStocksResult?.modifiedCount || 0;

            // Update cart items if stock quantity is insufficient
            const cartUpdates = carts
                .filter((item) => item.quantity > updatedStockCount)
                .map((item) => ({
                    updateMany: {
                        filter: {
                            product: item.product._id,
                            product_stock: item.product_stock._id,
                            quantity: { $gt: updatedStockCount },
                        },
                        update: { is_purchasable: false },
                    },
                }))

            if (cartUpdates.length > 0) {
                await this.cartRepository.updateBulkWrite({ queryFields: cartUpdates, session })
            }

            // Delete cart items after order creation
            await this.cartRepository.deletePurchasableProducts({ queryFieds: { user: userId, is_purchasable: true }, session })
        })
    }

    async find(queryFields: Partial<Order>): Promise<Order[]> {
        return this.orderModel.find(queryFields).sort({ createdAt: -1 }).lean()
    }

    async findOrderItem(queryFields: FindOrderItemParams): Promise<OrderItem[]> {
        return await this.orderItemModel.find(queryFields)
            .sort({ price: -1 })
    }

    async findOneOrderItem(queryFields: FindOneOrderItemParams): Promise<OrderItem | null> {
        return await this.orderItemModel.findOne(queryFields).lean()
    }
}