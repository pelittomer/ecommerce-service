import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Product } from "./product.schema";

interface Ratings {
    count: number;
    average: number;
}

export type ProductStatisticDocument = ProductStatistic & Document;

@Schema({ timestamps: true })
export class ProductStatistic {
    @Prop({ type: Number, default: 0 })
    views: number;

    @Prop({ type: Number, default: 0 })
    purchases: number;

    @Prop({ type: Number, default: 0 })
    favorites: number;

    @Prop({ type: Number, default: 0 })
    carts: number;

    @Prop({ type: Number, default: 0 })
    returnedQuantity: number;

    @Prop({
        type: {
            count: { type: Number, default: 0, },
            average: { type: Number, default: 0, }
        },
        _id: false,
        default: { count: 0, average: 0 },
    })
    ratings: Ratings;

    @Prop({ type: Types.ObjectId, ref: Product.name, required: true })
    product: Types.ObjectId;
}

export const ProductStatisticSchema = SchemaFactory.createForClass(ProductStatistic);