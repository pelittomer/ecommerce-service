import { Document } from "mongoose";
import { Category } from "./category.entity";

export type CategoryDocument = Category & Document;
