import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Category } from "./schemas/category.schema";
import { Model } from "mongoose";

Injectable()
export class CategoryRepository {
    constructor(
        @InjectModel(Category.name) private uploadModel: Model<Category>
    ) { }

}