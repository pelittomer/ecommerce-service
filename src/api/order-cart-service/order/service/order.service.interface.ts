import { Request } from "express";
import { Order } from "../entities/order.entity";
import { Types } from "mongoose";
import { OrderItem } from "../entities/order-item.entity";

export interface FindOrderDetailsParams {
    orderId: Types.ObjectId;
    req: Request;
}
export interface IOrderService {
    createOrder(req: Request): Promise<string>;
    findOrders(req: Request): Promise<Order[]>;
    findOrderDetails(params: FindOrderDetailsParams): Promise<OrderItem[]>;
}