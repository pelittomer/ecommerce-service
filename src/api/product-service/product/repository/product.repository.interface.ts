import { ClientSession, Types } from "mongoose";
import { CreateProductDto } from "../dto/create-product.dto";
import { Product } from "../entities/product.entity";
import { ProductDetail } from "../entities/product-details.entity";
import { UpdateProductDto } from "../dto/update-product.dto";
import { ProductStatistic } from "../entities/product-statistic.entity";
import { ProductStock } from "../entities/product-stock.entity";
import { BulkWriteResult } from 'mongodb';
import { ProductDetailDocument, ProductDocument } from "../entities/types";

export interface CreateProductOptions {
    payload: CreateProductDto;
    uploadedFiles: Record<string, Express.Multer.File[]>,
    companyId: Types.ObjectId
}
export interface FindProductAndDetailsOptions {
    productId: Types.ObjectId;
    companyId: Types.ObjectId;
}
export interface TFindProductAndDetails {
    product: ProductDocument | null;
    productDetails: ProductDetailDocument | null;
}
export interface UpdateProductOptions {
    product: ProductDocument,
    productDetails: ProductDetailDocument,
    uploadedFiles: Record<string, Express.Multer.File[]>,
    payload: UpdateProductDto,
    productId: Types.ObjectId
}
export interface TProductFindOne {
    products: Product | null;
    productDetails: ProductDetail | null;
    productStatistics: ProductStatistic | null;
    productStocks: ProductStock[];
}
export interface FindProductOptions {
    limit: number;
    startIndex: number;
    filter: any;
    sortCriteria: any;
}
export interface TFindProduct {
    productsLength: number;
    products: ProductDocument[]
}
export type FindProductExistsOptions = Partial<Product | Pick<ProductDocument, '_id'>>
export type TFindProductExists = Pick<ProductDocument, '_id'> | null
export interface FindOneAndUpdateStatisticOptions {
    query: Partial<ProductStatistic>;
    productId: Types.ObjectId;
    session?: ClientSession;
}
export interface UpdateManyProductStatisticOptions {
    query: Partial<ProductStatistic>;
    productIds: Types.ObjectId[];
    session: ClientSession;
}
export interface BulkUpdateStocksOptions {
    queryFields: any;
    session: ClientSession;
}
export interface IProductRepository {
    create(params: CreateProductOptions): Promise<void>;
    findProductAndDetails(params: FindProductAndDetailsOptions): Promise<TFindProductAndDetails>;
    update(params: UpdateProductOptions): Promise<void>;
    findOne(productId: Types.ObjectId): Promise<TProductFindOne>;
    find(params: FindProductOptions): Promise<TFindProduct>;
    findProductExists(queryFieds: FindProductExistsOptions): Promise<TFindProductExists>;
    findOneAndUpdateStatistic(params: FindOneAndUpdateStatisticOptions): Promise<void>;
    updateManyProductStatistic(params: UpdateManyProductStatisticOptions): Promise<void>;
    findStockItemById(stockId: Types.ObjectId): Promise<ProductStock | null>;
    findById(productId: Types.ObjectId): Promise<ProductDocument | null>;
    bulkUpdateStocks(params: BulkUpdateStocksOptions): Promise<BulkWriteResult>;
}