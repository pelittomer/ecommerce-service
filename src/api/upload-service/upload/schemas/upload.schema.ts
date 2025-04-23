import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UploadDocument = Upload & Document;

@Schema({ timestamps: true })
export class Upload {
    @Prop({ required: true })
    filename: string;

    @Prop({ required: true })
    fileContent: string;

    @Prop({ required: true })
    fileType: string;
};

export const UploadSchema = SchemaFactory.createForClass(Upload);