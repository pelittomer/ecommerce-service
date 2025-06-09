import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ReturnRequest } from "../entities/return-request.entity";
import { Model } from "mongoose";

@Injectable()
export class ReturnRequestRepository {
    constructor(
        @InjectModel(ReturnRequest.name) private returnRequestModel: Model<ReturnRequest>
    ) { }

    async create(payload: Partial<ReturnRequest>): Promise<void> {
        await this.returnRequestModel.create(payload)
    }
}