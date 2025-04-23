import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Shipper } from "./schemas/shipper.schema";
import { Model } from "mongoose";

@Injectable()
export class ShipperRepository {
    constructor(
        @InjectModel(Shipper.name) private shipperModel: Model<Shipper>
    ) { }

}