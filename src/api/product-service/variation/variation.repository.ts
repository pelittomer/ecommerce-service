import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Variation } from "./schemas/variation.schema";
import { VariationOption } from "./schemas/variation-option.schema";
import { Model } from "mongoose";

@Injectable()
export class VariationRepository {
    constructor(
        @InjectModel(Variation.name) private variationModel: Model<Variation>,
        @InjectModel(VariationOption.name) private variationOptionModel: Model<VariationOption>,
    ) { }

}