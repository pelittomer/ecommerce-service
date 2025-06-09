import { ClientSession, Types } from "mongoose";
import { Category } from "../entities/category.entity";
import { CreateCategoryDto } from "../dto/create-category.dto";

export interface CreateRootCategoryOptions {
    payload: Partial<Category>;
    session: ClientSession;
}
export interface CreateSubCategoryOptions {
    payload: Partial<Category>;
    parentId: Types.ObjectId;
    session: ClientSession;
}
export interface CreateCategoryOptions {
    payload: CreateCategoryDto;
    uploadedImage: { image: Express.Multer.File[], icon: Express.Multer.File[] };
}
export interface ICategoryRepository {
    createRootCategory(params: CreateRootCategoryOptions): Promise<void>;
    createSubCategory(params: CreateSubCategoryOptions): Promise<void>;
    create(params: CreateCategoryOptions): Promise<void>;
    findLeafs(): Promise<Category[]>;
    findRoots(): Promise<Category[]>;
    findTree(categoryId: Types.ObjectId);
}