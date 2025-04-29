import { IsMongoId, IsOptional } from "class-validator";
import { Types } from "mongoose";

export class GetReviewDto {
    @IsOptional()
    @IsMongoId({ each: false })
    productId?: Types.ObjectId;
}