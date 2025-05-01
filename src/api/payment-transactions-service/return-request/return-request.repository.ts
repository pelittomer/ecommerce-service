import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ReturnRequest } from "./schemas/return-request.schema";
import { Model } from "mongoose";

@Injectable()
export class ReturnRequestRepository {
    constructor(
        @InjectModel(ReturnRequest.name) private returnRequestModel: Model<ReturnRequest>
    ) { }

    async create(userInputs: Partial<ReturnRequest>): Promise<void> {
        await this.returnRequestModel.create(userInputs)
    }

}