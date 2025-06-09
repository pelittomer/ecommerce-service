import { Types } from "mongoose";
import { CreatePaymentDto } from "../dto/create-payment.dto"
import { Request } from "express";

export interface UpdatePaymentParams {
    payload: CreatePaymentDto;
    paymentId: Types.ObjectId;
    req: Request;
}
export interface IPaymentService {
    updatePayment(params: UpdatePaymentParams): Promise<string>;
}