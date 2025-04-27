import { Transform, Type } from "class-transformer";
import { IsMongoId, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { Types } from "mongoose";
import { BaseProductDto, BaseProductStockDto, UpdateCriteriaDto } from "./base-product.dto";

export class CreateProductDto extends BaseProductDto {
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value.trim())
    name: string;

    @IsMongoId()
    @IsNotEmpty()
    @Transform(({ value }) => value.trim())
    brand: Types.ObjectId;

    @IsMongoId()
    @IsNotEmpty()
    @Transform(({ value }) => value.trim())
    category: Types.ObjectId;

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => UpdateCriteriaDto)
    criteria: UpdateCriteriaDto[]

    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => BaseProductStockDto)
    stock: BaseProductStockDto[];
}