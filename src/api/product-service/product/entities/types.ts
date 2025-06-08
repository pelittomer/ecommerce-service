import { Document, Types } from "mongoose";
import { Product } from "./product.entity";
import { ProductStock } from "./product-stock.entity";
import { ProductDetail } from "./product-details.entity";
import { ProductStatistic } from "./product-statistic.entity";

export interface Discount {
    discount_percentage?: number;
    start_date?: Date;
    end_date: Date;
    applied_price?: number;
}
export type ProductDocument = Product & Document;

export interface VariationItem {
    variation: Types.ObjectId;
    options: Types.ObjectId;
}
export type ProductStockDocument = ProductStock & Document;

export interface Feature {
    name: string;
    value: string;
}
interface Option {
    option: Types.ObjectId;
    images?: Types.ObjectId[];
}
export interface Criteria {
    variation: Types.ObjectId;
    options: Option[];
}
export type ProductDetailDocument = ProductDetail & Document;

export interface Ratings {
    count: number;
    average: number;
}
export type ProductStatisticDocument = ProductStatistic & Document;