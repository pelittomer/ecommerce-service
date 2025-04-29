import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { Order } from 'src/api/order-cart-service/order/schemas/order.schema';
import { User } from 'src/api/user-service/user/schemas/user.schema';
import { PaymentMethod, PaymentStatus } from 'src/common/types';

interface CardDetails {
    card_number?: string;
    card_holder_name?: string;
    expiry_month?: number;
    expiry_year?: number;
}

interface EftDetails {
    sender_name?: string;
    sender_bank?: string;
    receiver_bank?: string;
    transfer_date?: Date;
}

interface PaymentDetails {
    card_details?: CardDetails;
    eft_details?: EftDetails;
}

interface RefundDetails {
    refund_amount?: number;
    refund_date?: Date;
    refund_reason?: string;
}

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment {
    @Prop({ type: String, enum: PaymentMethod })
    payment_method: PaymentMethod;

    @Prop({ type: String, enum: PaymentStatus, default: PaymentStatus.Pending })
    payment_status: PaymentStatus;

    @Prop({ type: Number, required: true, min: 0 })
    amount: number;

    @Prop({ type: String, required: true, default: 'TRY' })
    currency: string;

    @Prop({ type: Date, default: Date.now })
    payment_date: Date;

    @Prop({
        type: {
            card_details: {
                card_number: String,
                card_holder_name: String,
                expiry_month: Number,
                expiry_year: Number,
            },
            eft_details: {
                sender_name: String,
                sender_bank: String,
                receiver_bank: String,
                transfer_date: Date,
            },
        },
    })
    payment_details: PaymentDetails;

    @Prop({ type: String })
    failure_reason: string;

    @Prop({
        type: {
            refund_amount: Number,
            refund_date: Date,
            refund_reason: String,
        },
    })
    refund_details: RefundDetails;

    @Prop({ type: Types.ObjectId, ref: Order.name, required: true })
    order: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    user: Types.ObjectId;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment)