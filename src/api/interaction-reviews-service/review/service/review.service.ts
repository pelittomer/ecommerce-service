import { Injectable } from '@nestjs/common';
import { ReviewRepository } from '../repository/review.repository';
import { SharedUtilsService } from 'src/common/utils/shared-utils.service';
import { Types } from 'mongoose';
import { GetReviewDto } from '../dto/get-review.dto';
import { Review } from '../entities/review.entity';
import { CreateReviewParams, IReviewService } from './review.service.interface';
import { ReviewUtilsService } from '../utils/review-utils.service';
import { REVIEW_MESSAGE } from '../constants/review.message';

@Injectable()
export class ReviewService implements IReviewService {
    constructor(
        private readonly reviewRepository: ReviewRepository,
        private readonly sharedUtilsService: SharedUtilsService,
        private readonly reviewUtilsService: ReviewUtilsService,
    ) { }

    async createReview(params: CreateReviewParams): Promise<string> {
        const { payload, req, uploadedFiles } = params
        const { product, ...reviewDataWithoutProductId } = payload
        const userId = this.sharedUtilsService.getUserIdFromRequest(req)
        const productObjectId = new Types.ObjectId(product)

        await this.reviewUtilsService.validateProductExistence(product)

        const is_purchased = await this.reviewUtilsService.checkIfProductPurchased({ userId, productId: product })

        await this.reviewRepository.create({
            payload: {
                ...reviewDataWithoutProductId,
                product: productObjectId,
                user: userId,
                is_purchased,
            },
            uploadedFiles,
        })

        return REVIEW_MESSAGE.REVIEW_CREATED_SUCCESS
    }

    async findReviews(query: GetReviewDto): Promise<Review[]> {
        return this.reviewRepository.find(query)
    }
}
