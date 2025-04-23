import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Product } from "./product.schema";
import { Variation } from "../../variation/schemas/variation.schema";
import { VariationOption } from "../../variation/schemas/variation-option.schema";

interface VariationItem {
    variation: Types.ObjectId;
    options: Types.ObjectId;
}

export type ProductStockDocument = ProductStock & Document;

@Schema({ timestamps: true })
export class ProductStock {
    @Prop({ type: Number, default: 0 })
    stock_quantity: number;

    @Prop({ type: Number, default: 0 })
    additional_price: number;

    @Prop({ type: Boolean, default: false })
    is_limited: boolean;

    @Prop({ type: Boolean, default: false })
    auto_replenish: boolean;

    @Prop({ type: Number, default: 0 })
    replenish_quantity: number;

    @Prop({
        type: [{
            variation: { type: Types.ObjectId, ref: Variation.name, required: true },
            options: { type: Types.ObjectId, ref: VariationOption.name, required: true }
        }]
    })
    variations: VariationItem[];

    @Prop({ type: Types.ObjectId, ref: Product.name, required: true })
    product: Types.ObjectId;
}

export const ProductStockSchema = SchemaFactory.createForClass(ProductStock);