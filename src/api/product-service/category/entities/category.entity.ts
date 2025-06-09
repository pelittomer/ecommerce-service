import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { Upload } from "src/api/upload-service/upload/schemas/upload.schema";

@Schema({ timestamps: true })
export class Category {
    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: String, required: true })
    description: string;

    @Prop({ type: Types.ObjectId, ref: Upload.name, required: true })
    image: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: Upload.name, required: true })
    icon: Types.ObjectId;

    @Prop({ type: Number, required: true })
    left: number;

    @Prop({ type: Number, required: true })
    right: number;

    @Prop({ type: Number, default: 0 })
    view_count: number;

    @Prop({ type: Types.ObjectId, ref: Category.name })
    parent: Types.ObjectId;
}

export const CategorySchema = SchemaFactory.createForClass(Category)