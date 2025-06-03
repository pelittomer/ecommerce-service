import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { User } from "src/api/user-service/user/entities/user.entity";

@Schema({ timestamps: true })
export class Address {
    @Prop({ type: String, required: true })
    city: string;

    @Prop({ type: String, required: true })
    district: string;

    @Prop({ type: String, required: true })
    neighborhood: string;

    @Prop({ type: String, required: true })
    street: string;

    @Prop({ type: String })
    building_number: string;

    @Prop({ type: String, required: true })
    door_number: string;

    @Prop({ type: String, required: true })
    phone: string;

    @Prop({ type: Boolean, required: true, default: true })
    is_default: boolean

    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    user: Types.ObjectId;
}

export const AddressSchema = SchemaFactory.createForClass(Address);