import { ClientSession } from "mongoose";
import { Payment } from "../entities/payment.entity";
import { BulkWriteResult } from 'mongodb';
import { PaymentDocument } from "../entities/types";
export interface CreatePaymentOptions {
    payload: Pick<Payment, 'user' | 'order' | 'amount'>;
    session: ClientSession;
}
export interface FindOneAndUpdateOptions {
    payload: Partial<Payment>;
    queryFields: Partial<Pick<PaymentDocument, '_id' | 'user'>>;
}
export interface IPaymentRepository {
    create(params: CreatePaymentOptions): Promise<void>;
    findOneAndUpdate(params: FindOneAndUpdateOptions): Promise<void>;
    find(queryFields: Partial<Payment>): Promise<PaymentDocument[]>;
    bulkWrite(fields: any): Promise<BulkWriteResult>;
}