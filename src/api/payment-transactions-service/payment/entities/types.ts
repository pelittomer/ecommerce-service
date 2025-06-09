import { Document } from "mongoose";
import { Payment } from "./payment.entity";

export interface CardDetails {
    card_number?: string;
    card_holder_name?: string;
    expiry_month?: number;
    expiry_year?: number;
}

export interface EftDetails {
    sender_name?: string;
    sender_bank?: string;
    receiver_bank?: string;
    transfer_date?: Date;
}

export interface PaymentDetails {
    card_details?: CardDetails;
    eft_details?: EftDetails;
}

export interface RefundDetails {
    refund_amount?: number;
    refund_date?: Date;
    refund_reason?: string;
}

export type PaymentDocument = Payment & Document;

export enum PaymentMethod {
    CreditCard = "credit_card",
    EFT = "eft",
    PayPal = "paypal",
    MobilePayment = "mobile_payment",
    Other = "other"
}

export enum PaymentStatus {
    Pending = "pending",
    Processing = "processing",
    Completed = "completed",
    Failed = "failed",
    Refunded = "refunded",
    PartiallyRefunded = "partially_refunded"
}