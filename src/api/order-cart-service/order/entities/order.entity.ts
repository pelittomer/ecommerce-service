import { Prop, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { Address } from "src/api/profile-service/address/entities/address.entity";
import { User } from "src/api/user-service/user/entities/user.entity";
import { OrderStatus } from "./types";

export class Order {
    @Prop({ type: Number, required: true })
    total_amount: number;

    @Prop({
        type: String,
        enum: OrderStatus,
        default: OrderStatus.PaymentPending
    })
    status: OrderStatus;

    @Prop({ type: Types.ObjectId, ref: Address.name, required: true })
    address: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    user: Types.ObjectId;
}

export const OrderSchema = SchemaFactory.createForClass(Order);