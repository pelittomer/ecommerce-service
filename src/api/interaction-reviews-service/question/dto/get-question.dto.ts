import { IsMongoId, IsOptional } from "class-validator";
import { Types } from "mongoose";

export class GetQuestionDto {
    @IsOptional()
    @IsMongoId({ each: false })
    productId?: Types.ObjectId;
}