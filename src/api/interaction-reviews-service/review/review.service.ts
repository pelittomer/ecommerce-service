import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { Request } from 'express';
import { ReviewRepository } from './review.repository';
import { SharedUtilsService } from 'src/common/utils/shared-utils.service';
import { ProductRepository } from 'src/api/product-service/product/repository/product.repository';
import { Types } from 'mongoose';
import { OrderRepository } from 'src/api/order-cart-service/order/repository/order.repository';
import { GetReviewDto } from './dto/get-review.dto';
import { Review } from './schemas/review.schema';

@Injectable()
export class ReviewService {
    constructor(
        private readonly reviewRepository: ReviewRepository,
        private readonly productRepository: ProductRepository,
        private readonly orderRepository: OrderRepository,
        private readonly sharedUtilsService: SharedUtilsService,
    ) { }

    async createReview(
        userInputs: CreateReviewDto,
        req: Request,
        uploadedFiles: Express.Multer.File[]
    ): Promise<string> {
        const { product, ...elementWithoutProductId } = userInputs
        const user = this.sharedUtilsService.getUserInfo(req)
        const userId = new Types.ObjectId(user.userId)

        const productExits = await this.productRepository.findById(product)
        if (!productExits) {
            throw new NotFoundException('Product not found!')
        }

        const isPurchased = await this.orderRepository.findOneOrderItemExists({ user: userId, product })

        await this.reviewRepository.create(
            {
                ...elementWithoutProductId,
                product: new Types.ObjectId(userInputs.product),
                user: userId,
                is_purchased: !!isPurchased,
            },
            uploadedFiles
        )

        return 'Review successfully created.'
    }

    async findReviews(query: GetReviewDto): Promise<Review[]> {
        return this.reviewRepository.find(query)
    }
}
