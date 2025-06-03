import { Types } from "mongoose";
import { CreateVariationDto } from "../dto/create-variation.dto";

export interface IVariationRepository {
    create(payload: CreateVariationDto): Promise<void>;
    find(categoryId: Types.ObjectId): Promise<any>
}