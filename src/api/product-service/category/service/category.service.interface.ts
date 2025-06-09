import { Types } from "mongoose";
import { Category } from "../entities/category.entity";
import { CreateCategoryDto } from "../dto/create-category.dto";

export interface CreateCategoryProps {
    payload: CreateCategoryDto;
    uploadedImage: { image: Express.Multer.File[], icon: Express.Multer.File[] }
}

export interface ICategoryService {
    createCategory(params: CreateCategoryProps): Promise<string>;
    findLeafs(): Promise<Category[]>;
    findRoots(): Promise<Category[]>;
    findTree(categoryId: Types.ObjectId);
}