import { AddressDocument } from "src/api/profile-service/address/entities/types"
import { PopulateCart } from "../../cart/cart.repository"
import { Types } from "mongoose"
import { Order } from "../entities/order.entity";
import { OrderItem } from "../entities/order-item.entity";
import { OrderDocument, OrderItemDocument } from "../entities/types";

export interface CreateOrderParams {
    carts: PopulateCart[],
    defaultAddress: Pick<AddressDocument, '_id'>;
    totalAmount: number,
    userId: Types.ObjectId
}
export type FindOrderItemParams = Pick<OrderItem, 'user' | 'order'>
export type FindOneOrderItemParams = Pick<OrderItemDocument, '_id' | 'user'>
export interface IOrderRepository {
    findOneOrderItemExists(queryFields: Partial<OrderItem>): Promise<Pick<OrderDocument, '_id'> | null>
    create(params: CreateOrderParams): Promise<void>;
    find(queryFields: Partial<Order>): Promise<Order[]>;
    findOrderItem(queryFields: FindOrderItemParams): Promise<OrderItem[]>;
    findOneOrderItem(queryFields: FindOneOrderItemParams): Promise<OrderItem | null>;
}