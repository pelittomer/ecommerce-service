import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Upload } from "src/api/upload-service/upload/schemas/upload.schema";
import { User } from "src/api/user-service/user/schemas/user.schema";
import { Gender } from "src/common/types";

export type UserDetailsDocument = UserDetails & Document;

@Schema({ timestamps: true })
export class UserDetails {
    @Prop()
    first_name: string;

    @Prop()
    last_name: string;

    @Prop()
    birth_of_date: Date

    @Prop({ enum: Gender, default: Gender.PreferNotToSay })
    gender: Gender;

    @Prop({ type: Types.ObjectId, ref: Upload.name })
    avatar: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: User.name, required: true, unique: true })
    user: Types.ObjectId;
}

export const UserDetailsSchema = SchemaFactory.createForClass(UserDetails);