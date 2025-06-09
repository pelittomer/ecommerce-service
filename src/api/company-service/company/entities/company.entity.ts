import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { Upload } from "src/api/upload-service/upload/schemas/upload.schema";
import { User } from "src/api/user-service/user/entities/user.entity";
import { CompanyStatus } from "./types";

@Schema({ timestamps: true })
export class Company {
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

    @Prop({ type: String, required: true, unique: true })
    tax_id: string;

    @Prop({ type: String, required: true })
    tax_office: string;

    @Prop({ type: String, enum: CompanyStatus, default: CompanyStatus.Pending })
    status: string; 

    @Prop({ type: String })
    rejection_reason: string; 

    @Prop({ type: Types.ObjectId, ref: User.name, required: true, unique: true })
    user: Types.ObjectId;
}

export const CompanySchema = SchemaFactory.createForClass(Company);