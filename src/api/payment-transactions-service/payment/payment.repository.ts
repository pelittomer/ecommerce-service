import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Payment, PaymentDocument } from "./schemas/payment.schema";
import { ClientSession, Model } from "mongoose";

@Injectable()
export class PaymentRepository {
    constructor(
        @InjectModel(Payment.name) private paymentModel: Model<Payment>
    ) { }

    async create(userInputs: Pick<Payment, 'user' | 'order' | 'amount'>, session: ClientSession): Promise<void> {
        await this.paymentModel.create([userInputs], { session })
    }

    async findOneAndUpdate(userInputs: Partial<Payment>, queryFields: Partial<Pick<PaymentDocument, '_id' | 'user'>>) {
        await this.paymentModel.findOneAndUpdate(queryFields, userInputs)
    }

    async find(queryFields: Partial<Payment>): Promise<PaymentDocument[]> {
        return await this.paymentModel.find(queryFields)
    }

    async bulkWrite(fields: any): Promise<any> {
        return await this.paymentModel.bulkWrite(fields)
    }
}