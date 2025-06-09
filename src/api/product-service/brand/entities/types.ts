import { Document } from "mongoose";
import { Brand } from "./brand.entity";

export type BrandDocument = Brand & Document;
