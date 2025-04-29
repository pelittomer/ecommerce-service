import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Payment } from "./schemas/payment.schema";
import { ClientSession, Model } from "mongoose";

@Injectable()
export class PaymentRepository {
    constructor(
        @InjectModel(Payment.name) private paymentModel: Model<Payment>
    ) { }

    async create(userInputs: Pick<Payment, 'user' | 'order' | 'amount'>, session: ClientSession): Promise<void> {
        await this.paymentModel.create([userInputs], { session })
    }
}