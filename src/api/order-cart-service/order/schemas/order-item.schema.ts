import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { ProductStock } from "src/api/product-service/product/schemas/product-stock.schema";
import { Product } from "src/api/product-service/product/schemas/product.schema";
import { OrderStatus } from "src/common/types";
import { Order } from "./order.schema";
import { User } from "src/api/user-service/user/schemas/user.schema";

export type OrderItemDocument = OrderItem & Document;

@Schema({ timestamps: true })
export class OrderItem {
    @Prop({ type: Number, required: true, min: 0 })
    price: number;

    @Prop({ type: Number, required: true })
    quantity: number;

    @Prop({
        type: String,
        enum: OrderStatus,
        default: OrderStatus.PaymentPending
    })
    status: OrderStatus;

    @Prop({ type: Types.ObjectId, ref: Product.name, required: true })
    product: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: ProductStock.name, required: true })
    product_stock: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: Order.name, required: true })
    order: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    user: Types.ObjectId;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);