import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Payment } from "../entities/payment.entity";
import { Model } from "mongoose";
import { CreatePaymentOptions, FindOneAndUpdateOptions, IPaymentRepository } from "./payment.repository.interface";
import { BulkWriteResult } from 'mongodb';
import { PaymentDocument } from "../entities/types";

@Injectable()
export class PaymentRepository implements IPaymentRepository {
    constructor(
        @InjectModel(Payment.name) private paymentModel: Model<Payment>
    ) { }

    async create(params: CreatePaymentOptions): Promise<void> {
        const { session, payload } = params
        await this.paymentModel.create([payload], { session })
    }

    async findOneAndUpdate(params: FindOneAndUpdateOptions): Promise<void> {
        const { payload, queryFields } = params
        await this.paymentModel.findOneAndUpdate(queryFields, payload)
    }

    async find(queryFields: Partial<Payment>): Promise<PaymentDocument[]> {
        return await this.paymentModel.find(queryFields)
    }

    async bulkWrite(fields: any): Promise<BulkWriteResult> {
        return await this.paymentModel.bulkWrite(fields)
    }
}