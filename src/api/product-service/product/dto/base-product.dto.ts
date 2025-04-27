import { PickType } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Max, Min, ValidateNested } from "class-validator";
import { Types } from "mongoose";

class FeatureDto {
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value.trim())
    name: string;

    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value.trim())
    value: string;
}

class VariationItemDto {
    @IsOptional()
    @IsMongoId()
    variation: Types.ObjectId;

    @IsOptional()
    @IsMongoId()
    options: Types.ObjectId;
}

class OptionDto {
    @IsMongoId()
    option: Types.ObjectId;

    @IsArray()
    @IsOptional()
    @IsMongoId({ each: true })
    images: Types.ObjectId[]
}

export class DiscountDto {
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(100)
    discount_percentage: number;

    @IsDate()
    start_date: Date;

    @IsDate()
    end_date: Date;

    @IsOptional()
    @IsNumber()
    @Min(0)
    applied_price: number;
}

export class BaseProductDto {
    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    price: number;

    @IsMongoId()
    @IsNotEmpty()
    @Transform(({ value }) => value.trim())
    shipper: Types.ObjectId;

    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value.trim())
    description: string;

    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value.trim())
    short_description: string;

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => FeatureDto)
    features: FeatureDto[]
}

export class UpdateCriteriaDto {
    @IsMongoId()
    variation: Types.ObjectId;

    @ValidateNested({ each: true })
    @Type(() => PickType(OptionDto, ['option'] as const))
    options: Pick<OptionDto, 'option'>[]
}

export class CreateCriteriaDto {
    @IsMongoId()
    variation: Types.ObjectId;

    @ValidateNested({ each: true })
    @Type(() => OptionDto)
    options: OptionDto[]
}

export class BaseProductStockDto {
    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    @IsPositive()
    stock_quantity: number;

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    @IsPositive()
    additional_price: number;

    @Type(() => Boolean)
    @IsOptional()
    @IsBoolean()
    is_limited: boolean;

    @Type(() => Boolean)
    @IsOptional()
    @IsBoolean()
    auto_replenish: boolean;

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    @IsPositive()
    replenish_quantity: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => VariationItemDto)
    variations: VariationItemDto[];
}