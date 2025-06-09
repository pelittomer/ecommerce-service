import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { Upload } from "src/api/upload-service/upload/schemas/upload.schema";

@Schema({ timestamps: true })
export class Brand {
    @Prop({ type: String, required: true, unique: true })
    name: string;

    @Prop({ type: Types.ObjectId, ref: Upload.name, required: true })
    logo: Types.ObjectId;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);