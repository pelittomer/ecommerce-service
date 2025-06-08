import { ClientSession, Types } from "mongoose";
import { CompanyDocument } from "src/api/company-service/company/schemas/company.schema";
import { UpdateProductDto } from "../dto/update-product.dto";
import { CreateProductDto } from "../dto/create-product.dto";
import { ProductDetailDocument, ProductDocument } from "../entities/types";

export interface ValidateAndGroupUploadedFilesParams {
    files: Express.Multer.File[];
    requireFiles: boolean;
}

export interface ProcessCriteriaImagesParams {
    criteria: UpdateProductDto['criteria'] | CreateProductDto['criteria'];
    images: Record<string, Types.ObjectId[]>;
}
export interface SaveUploadedImagesParams {
    uploadedFiles: Record<string, Express.Multer.File[]>;
    session: ClientSession;
}
export interface GetDeleteImageIdsParams {
    products: ProductDocument;
    productDetails: ProductDetailDocument;
    payload: UpdateProductDto;
}

export interface IProductUtilsService {
    validateAndGroupUploadedFiles(params: ValidateAndGroupUploadedFilesParams): Record<string, Express.Multer.File[]>;
    validateUserCompany(userId: Types.ObjectId): Promise<CompanyDocument>;
    processCriteriaImages(params: ProcessCriteriaImagesParams): UpdateProductDto['criteria'];
    saveUploadedImages(params: SaveUploadedImagesParams): Promise<Record<string, Types.ObjectId[]>>;
    getDeleteImageIds(params: GetDeleteImageIdsParams): Types.ObjectId[];
}