import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { ProductStock } from "src/api/product-service/product/entities/product-stock.entity";
import { Product } from "src/api/product-service/product/entities/product.entity";
import { Order } from "./order.entity";
import { User } from "src/api/user-service/user/entities/user.entity";
import { OrderStatus } from "./types";

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