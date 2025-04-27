import { Transform } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, IsArray, IsMongoId } from "class-validator";
import { Types } from "mongoose";

export class CreateVariationDto {
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value.trim())
    name: string;

    @IsMongoId()
    @IsOptional()
    category?: Types.ObjectId;

    @IsArray()
    @IsNotEmpty()
    options: string[];
}