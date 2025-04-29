import { Type } from "class-transformer";
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Max, Min } from "class-validator";
import { Types } from "mongoose";

export class CreateReviewDto {
    @IsOptional()
    @IsString()
    comment: string;

    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    @Min(1)
    @Max(5)
    rate: number;

    @IsMongoId()
    @IsNotEmpty()
    product: Types.ObjectId
}
