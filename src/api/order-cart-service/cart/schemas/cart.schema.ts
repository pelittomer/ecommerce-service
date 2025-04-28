import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { ProductStock } from "src/api/product-service/product/schemas/product-stock.schema";
import { Product } from "src/api/product-service/product/schemas/product.schema";
import { User } from "src/api/user-service/user/schemas/user.schema";

export type CartDocument = Cart & Document;

@Schema({ timestamps: true })
export class Cart {
    @Prop({ type: Number, default: 1, min: 1 })
    quantity: number;

    @Prop({ type: Boolean, default: true })
    is_purchasable?: boolean;

    @Prop({ type: Types.ObjectId, ref: Product.name, required: true })
    product: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: ProductStock.name, required: true })
    product_stock: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    user: Types.ObjectId;
}

export const CartSchema = SchemaFactory.createForClass(Cart);