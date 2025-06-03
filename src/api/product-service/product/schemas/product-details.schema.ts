import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Product } from "./product.schema";
import { Variation } from "../../variation/entities/variation.entity";
import { VariationOption } from "../../variation/entities/variation-option.entity";
import { Upload } from "src/api/upload-service/upload/schemas/upload.schema";

interface Feature {
    name: string;
    value: string;
}
interface Option {
    option: Types.ObjectId;
    images?: Types.ObjectId[];
}
interface Criteria {
    variation: Types.ObjectId;
    options: Option[];
}

export type ProductDetailDocument = ProductDetail & Document;

@Schema({ timestamps: true })
export class ProductDetail {
    @Prop({ type: String, required: true })
    description: string;

    @Prop({ type: String, required: true })
    short_description: string;

    @Prop({ type: [{ name: String, value: String, _id: false }] })
    features: Feature[];

    @Prop({
        type: [{
            variation: { type: Types.ObjectId, ref: Variation.name, required: true },
            options: [{
                option: { type: Types.ObjectId, ref: VariationOption.name, required: true },
                images: [{ type: Types.ObjectId, ref: Upload.name }]
            }]
        }]
    })
    criteria: Criteria[];

    @Prop({ type: Types.ObjectId, ref: Product.name, required: true })
    product: Types.ObjectId;
}

export const ProductDetailSchema = SchemaFactory.createForClass(ProductDetail);