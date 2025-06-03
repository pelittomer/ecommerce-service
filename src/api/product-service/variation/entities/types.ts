import { Document } from "mongoose";
import { VariationOption } from "./variation-option.entity";
import { Variation } from "./variation.entity";

export type VariationOptionDocument = VariationOption & Document;
export type VariationDocument = Variation & Document;
