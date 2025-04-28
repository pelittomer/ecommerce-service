import { PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsMongoId, IsNumber, IsString, Min } from "class-validator";
import { Types } from "mongoose";

enum ProductSort {
    PRICE_DESC = 'price_desc',
    PRICE_ASC = 'price_asc',
    PURCHASES_DESC = 'purchases_desc',
    FAVORITES_DESC = 'favorites_desc',
    RATINGS_DESC = 'ratings_desc',
    CARTS_DESC = 'carts_desc',
    VIEWS_DESC = 'views_desc',
    CREATED_AT_DESC = 'createdAt_desc',
}

export class GetProductDto {
    @IsMongoId()
    categoryId: Types.ObjectId;

    @IsNumber()
    @Min(0)
    minPrice: number;

    @IsNumber()
    @Min(0)
    maxPrice: number;

    @IsEnum(ProductSort)
    sort: ProductSort

    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page: number;

    @IsMongoId()
    company: Types.ObjectId;

    @IsMongoId()
    brand: Types.ObjectId;

    @IsString()
    q: string;
}

export class PartialGetProductDto extends PartialType(GetProductDto) { }

