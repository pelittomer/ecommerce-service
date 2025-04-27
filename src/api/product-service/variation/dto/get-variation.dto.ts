import { IsMongoId, IsOptional } from "class-validator";
import { Types } from "mongoose";

export class GetVariationDto {
    @IsOptional()
    @IsMongoId({ each: false })
    categoryId?: Types.ObjectId;
}