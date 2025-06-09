import { Document } from "mongoose";
import { Category } from "./category.schema";

export type CategoryDocument = Category & Document;
