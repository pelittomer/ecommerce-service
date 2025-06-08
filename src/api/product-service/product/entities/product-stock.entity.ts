import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { Product } from "./product.entity";
import { Variation } from "../../variation/entities/variation.entity";
import { VariationOption } from "../../variation/entities/variation-option.entity";
import { VariationItem } from "./types";

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