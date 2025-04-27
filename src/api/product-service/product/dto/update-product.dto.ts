import { Transform, Type } from "class-transformer";
import { IsArray, IsBoolean, IsMongoId, IsOptional, ValidateNested } from "class-validator";
import { Types } from "mongoose";
import { BaseProductDto, BaseProductStockDto, CreateCriteriaDto, DiscountDto } from "./base-product.dto";
import { PartialType } from "@nestjs/swagger";

class ProductStockDto extends BaseProductStockDto {
    @IsMongoId()
    @IsOptional()
    @Transform(({ value }) => value.trim())
    _id: Types.ObjectId
}

export class UpdateProductDto extends PartialType(BaseProductDto) {
    @Type(() => DiscountDto)
    @IsOptional()
    @ValidateNested()
    discount: DiscountDto;

    @Type(() => Boolean)
    @IsBoolean()
    is_published: boolean;

    @IsArray()
    @IsOptional()
    @IsMongoId({ each: true })
    images: Types.ObjectId[]

    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreateCriteriaDto)
    criteria: CreateCriteriaDto[]

    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => ProductStockDto)
    stock: ProductStockDto[];
}