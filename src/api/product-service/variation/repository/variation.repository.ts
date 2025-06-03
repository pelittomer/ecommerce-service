import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Variation } from "../entities/variation.entity";
import { VariationOption } from "../entities/variation-option.entity";
import { Model, Types } from "mongoose";
import { CreateVariationDto } from "../dto/create-variation.dto";
import { SharedUtilsService } from "src/common/utils/shared-utils.service";
import { IVariationRepository } from "./variation.repository.interface";

@Injectable()
export class VariationRepository implements IVariationRepository {
    constructor(
        @InjectModel(Variation.name) private variationModel: Model<Variation>,
        @InjectModel(VariationOption.name) private variationOptionModel: Model<VariationOption>,
        private readonly sharedUtilsService: SharedUtilsService
    ) { }

    async create(payload: CreateVariationDto): Promise<void> {
        await this.sharedUtilsService.executeTransaction(async (session) => {
            const [newVariation] = await this.variationModel.create([{
                name: payload.name,
                category: payload.category
            }], { session })
            const variationOptions = payload.options.map(option => ({
                name: option,
                variation: newVariation._id
            }))
            await this.variationOptionModel.insertMany(variationOptions, { session })
        })
    }

    async find(categoryId: Types.ObjectId) {
        return this.variationModel.aggregate([
            {
                $match: {
                    $or: [
                        { category: categoryId },
                        { category: { $exists: false } },
                        { category: null }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'variationoptions',
                    localField: '_id',
                    foreignField: 'variation',
                    as: 'options'
                }
            },
            { $sort: { name: 1 } },
            { $project: { name: 1, options: 1 } }
        ])
    }
}