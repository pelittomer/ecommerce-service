import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Category } from "../../category/schemas/category.schema";

export type VariationDocument = Variation & Document;

@Schema({ timestamps: true })
export class Variation {
    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: Types.ObjectId, ref: Category.name })
    category: Types.ObjectId;
}

export const VariationSchema = SchemaFactory.createForClass(Variation)