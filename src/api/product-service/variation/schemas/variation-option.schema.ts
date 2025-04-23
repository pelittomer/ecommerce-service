import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Variation } from "./variation.schema";

export type VariationOptionDocument = VariationOption & Document;

@Schema({ timestamps: true })
export class VariationOption {
    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: Types.ObjectId, ref: Variation.name, required: true })
    variation: Types.ObjectId;
}

export const VariationOptionSchema = SchemaFactory.createForClass(VariationOption);