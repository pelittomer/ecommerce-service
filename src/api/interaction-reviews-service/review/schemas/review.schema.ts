import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Product } from "src/api/product-service/product/schemas/product.schema";
import { Upload } from "src/api/upload-service/upload/schemas/upload.schema";
import { User } from "src/api/user-service/user/entities/user.entity";

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {
    @Prop({ type: String, required: true })
    comment: string;

    @Prop({ type: Number, required: true, min: 1, max: 5 })
    rate: number;

    @Prop({ type: Boolean, default: false })
    is_purchased: boolean;

    @Prop([{ type: Types.ObjectId, ref: Upload.name }])
    images: Types.ObjectId[];

    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    user: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: Product.name, required: true })
    product: Types.ObjectId;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);