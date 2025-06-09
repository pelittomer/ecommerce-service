import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Review } from "../entities/review.entity";
import { Model, Types } from "mongoose";
import { SharedUtilsService } from "src/common/utils/shared-utils.service";
import { UploadService } from "src/api/upload-service/upload/upload.service";
import { ProductRepository } from "src/api/product-service/product/repository/product.repository";
import { GetReviewDto } from "../dto/get-review.dto";
import { CreateReviewOptions, IReviewRepository } from "./review.repository.interface";

@Injectable()
export class ReviewRepository implements IReviewRepository {
    constructor(
        @InjectModel(Review.name) private reviewModel: Model<Review>,
        private readonly sharedUtilsService: SharedUtilsService,
        private readonly uploadService: UploadService,
        private readonly productRepository: ProductRepository,
    ) { }

    async create(params: CreateReviewOptions): Promise<void> {
        const { payload, uploadedFiles } = params
        await this.sharedUtilsService.executeTransaction(async (session) => {
            const images = await this.uploadService.createImage(uploadedFiles, session)

            await this.reviewModel.create([
                { ...payload, images }
            ], { session })

            await this.productRepository.findOneAndUpdateStatistic({
                query: {
                    ratings: {
                        count: 1,
                        average: payload.rate
                    }
                },
                productId: payload.product, session
            })
        })
    }

    async find(query: GetReviewDto): Promise<Review[]> {
        return this.reviewModel.find({ product: new Types.ObjectId(query.productId) }).lean()
    }
}