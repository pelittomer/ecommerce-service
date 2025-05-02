import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Log } from "./schemas/logger.shema";
import { Model } from "mongoose";

@Injectable()
export class LogModel {
    constructor(@InjectModel(Log.name) private logModel: Model<Log>) { }

    async create(log: Partial<Log>): Promise<void> {
        await this.logModel.create(log)
    }
}