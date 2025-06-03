import { Types } from "mongoose";
import { CreateVariationDto } from "../dto/create-variation.dto";

export interface IVariationService {
    createVariation(payload: CreateVariationDto): Promise<string>;
    findVariation(categoryId: Types.ObjectId): Promise<any>
}