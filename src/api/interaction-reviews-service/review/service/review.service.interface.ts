import { Request } from "express";
import { CreateReviewDto } from "../dto/create-review.dto";
import { GetReviewDto } from "../dto/get-review.dto";
import { Review } from "../entities/review.entity";

export interface CreateReviewParams {
    payload: CreateReviewDto;
    req: Request;
    uploadedFiles: Express.Multer.File[];
}
export interface IReviewService {
    createReview(params: CreateReviewParams): Promise<string>;
    findReviews(query: GetReviewDto): Promise<Review[]>;
}