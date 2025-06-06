import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Upload } from "src/api/upload-service/upload/schemas/upload.schema";
import { Brand } from "../../brand/schemas/brand.schema";
import { Company } from "src/api/company-service/company/schemas/company.schema";
import { Shipper } from "src/api/payment-transactions-service/shipper/schemas/shipper.schema";
import { Category } from "../../category/schemas/category.schema";

interface Discount {
    discount_percentage?: number;
    start_date?: Date;
    end_date: Date;
    applied_price?: number;
}

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: Number, required: true })
    price: number;

    @Prop({
        type: {
            discount_percentage: { type: Number, min: 0, max: 100 },
            start_date: { type: Date, default: Date.now },
            end_date: { type: Date, required: true },
            applied_price: { type: Number }
        }
    })
    discount: Discount;

    @Prop({ type: Boolean, default: false })
    is_published: boolean;

    @Prop([{ type: Types.ObjectId, ref: Upload.name, required: true }])
    images: Types.ObjectId[];

    @Prop({ type: Types.ObjectId, ref: Brand.name, required: true })
    brand: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: Company.name, required: true })
    company: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: Shipper.name, required: true })
    shipper: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: Category.name, required: true })
    category: Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);