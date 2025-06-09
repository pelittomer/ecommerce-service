import { CreateReviewDto } from "../dto/create-review.dto"
import { GetReviewDto } from "../dto/get-review.dto";
import { Review } from "../entities/review.entity"

type MergedReviewDto = CreateReviewDto & Pick<Review, 'user' | 'is_purchased'>;
export interface CreateReviewOptions {
    payload: MergedReviewDto;
    uploadedFiles: Express.Multer.File[];
}
export interface IReviewRepository {
    create(params: CreateReviewOptions): Promise<void>;
    find(query: GetReviewDto): Promise<Review[]>
}