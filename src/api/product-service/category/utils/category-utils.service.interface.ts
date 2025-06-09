import { Types } from "mongoose";
import { CategoryDocument } from "../schemas/types";

export interface BuildCategoryTreeParams {
    categoryId: Types.ObjectId;
    categories: CategoryDocument[];
}
export interface FindPathToRootParams {
    currentNode: any;
    categoryMap: Map<string, any>;
}
export interface ICategoryUtilsService {
    buildCategoryTree(params: BuildCategoryTreeParams): any[];
}