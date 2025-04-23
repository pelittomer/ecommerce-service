import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Product } from "./schemas/product.schema";
import { ProductDetail } from "./schemas/product-details.schema";
import { ProductStock } from "./schemas/product-stock.schema";
import { ProductStatistic } from "./schemas/product-statistic.schema";
import { Model } from "mongoose";

@Injectable()
export class ProductRepository {
    constructor(
        @InjectModel(Product.name) private productModel: Model<Product>,
        @InjectModel(ProductDetail.name) private productDetailModel: Model<ProductDetail>,
        @InjectModel(ProductStock.name) private productStockModel: Model<ProductStock>,
        @InjectModel(ProductStatistic.name) private productStatisticModel: Model<ProductStatistic>,
    ) { }

}