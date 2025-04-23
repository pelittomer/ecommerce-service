import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Upload } from "src/api/upload-service/upload/schemas/upload.schema";
import { User } from "src/api/user-service/user/schemas/user.schema";
import { CompanyStatus } from "src/common/types";

export type CompanyDocument = Company & Document;

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
    tax_id: string; // Vergi numarası

    @Prop({ type: String, required: true })
    tax_office: string; // Vergi dairesi

    @Prop({ type: String, enum: CompanyStatus, default: CompanyStatus.Pending })
    status: string; // Başvuru durumu (beklemede, onaylandı, reddedildi)

    @Prop({ type: String })
    rejection_reason: string; // Reddetme nedeni (isteğe bağlı)

    @Prop({ type: Types.ObjectId, ref: User.name, required: true, unique: true })
    user: Types.ObjectId;
}

export const CompanySchema = SchemaFactory.createForClass(Company);