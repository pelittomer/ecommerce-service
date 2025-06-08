import { Types } from "mongoose";
import { CreateProductDto } from "../dto/create-product.dto";
import { Request } from "express";
import { UpdateProductDto } from "../dto/update-product.dto";
import { PartialGetProductDto } from "../dto/get-product.dto";
import { TFindProduct, TProductFindOne } from "../repository/product.repository.interface";

export interface CreateProductServiceParams {
    payload: CreateProductDto;
    req: Request;
    uploadedFiles: Record<string, Express.Multer.File[]>;
}
export interface UpdateProductServiceParams {
    payload: UpdateProductDto;
    req: Request;
    uploadedFiles: Record<string, Express.Multer.File[]>;
    productId: Types.ObjectId
}
export interface IProductService {
    createProduct(params: CreateProductServiceParams): Promise<string>;
    updateProduct(params: UpdateProductServiceParams): Promise<string>;
    findProductDetails(productId: Types.ObjectId): Promise<TProductFindOne>;
    findProducts(queryFields: PartialGetProductDto): Promise<TFindProduct>;
}