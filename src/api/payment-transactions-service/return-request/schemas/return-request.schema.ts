import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { OrderItem } from "src/api/order-cart-service/order/schemas/order-item.schema";
import { ReturnRequestStatus } from "src/common/types";

export type ReturnRequestDocument = ReturnRequest & Document;

@Schema({ timestamps: true })
export class ReturnRequest {
    @Prop({ type: String, required: true })
    returnCode: string;

    @Prop({ type: String })
    reason?: string;

    @Prop({ type: Number, default: 1 })
    quantity: number;

    @Prop({ type: String, enum: ReturnRequestStatus, default: ReturnRequestStatus.ReturnRequested })
    status: string;

    @Prop({ type: Date })
    approvedAt?: Date;

    @Prop({ type: Date })
    rejectedAt?: Date;

    @Prop({ type: Date })
    completedAt?: Date;

    @Prop({ type: String })
    rejectionReason: string;

    @Prop({ type: String })
    shippingTrackingCode?: string;

    @Prop({ type: Types.ObjectId, ref: OrderItem.name, required: true })
    orderItem: Types.ObjectId;

    @Prop({ type: Types.ObjectId, required: true })
    user: Types.ObjectId;
}

export const ReturnRequestSchema = SchemaFactory.createForClass(ReturnRequest);