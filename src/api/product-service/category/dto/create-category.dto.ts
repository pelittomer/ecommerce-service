import { ApiProperty} from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";

export class CreateCategoryDto {
    @ApiProperty({ description: "The name of the category", example: "Electronics", })
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value.trim())
    name: string;

    @ApiProperty({ description: "A brief description of the category", example: "Devices, gadgets, and tech accessories", })
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value.trim())
    description: string;

    @ApiProperty({ description: "The ID of the parent category (optional)", example: "642b84e51c4a293c2a497e38", required: false, })
    @IsMongoId({ each: false })
    @IsOptional()
    @Transform(({ value }) => value.trim())
    parent: Types.ObjectId;
}