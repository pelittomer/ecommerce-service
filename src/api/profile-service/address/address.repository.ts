import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Address } from "./schemas/address.schema";

@Injectable()
export class AddressRepository {
    constructor(
        @InjectModel(Address.name) private uploadModel: Model<Address>
    ) { }

}