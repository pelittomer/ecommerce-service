import { Document } from "mongoose";
import { Review } from "./review.entity";

export type ReviewDocument = Review & Document;
