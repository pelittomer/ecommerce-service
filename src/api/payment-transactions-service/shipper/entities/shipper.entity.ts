import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { Upload } from "src/api/upload-service/upload/schemas/upload.schema";

@Schema({ timestamps: true })
export class Shipper {
    @Prop({ required: true, unique: true })
    name: string;

    @Prop({ type: Types.ObjectId, ref: Upload.name, required: true })
    logo: Types.ObjectId;

    @Prop({ required: true })
    description: string;

    @Prop()
    website: string;

    @Prop({ required: true })
    phone: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    address: string;

    @Prop({ type: Boolean, default: true })
    is_active: boolean;

    @Prop({ required: true, unique: true })
    api_key: string;
}

export const ShipperSchema = SchemaFactory.createForClass(Shipper);