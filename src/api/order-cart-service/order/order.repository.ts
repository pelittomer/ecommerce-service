import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Order, OrderDocument } from "./schemas/order.schema";
import { Model } from "mongoose";
import { OrderItem } from "./schemas/order-item.schema";

@Injectable()
export class OrderRepository {
    constructor(
        @InjectModel(Order.name) private orderModel: Model<Order>,
        @InjectModel(OrderItem.name) private orderItemModel: Model<OrderItem>
    ) { }

    async findOneOrderItemExists(queryFields: Partial<OrderItem>): Promise<Pick<OrderDocument, '_id'> | null> {
        return await this.orderItemModel.exists(queryFields)
    }
}