import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Brand } from "./schemas/brand.schema";

@Injectable()
export class BrandRepository {
    constructor(
        @InjectModel(Brand.name) private uploadModel: Model<Brand>
    ) { }

}