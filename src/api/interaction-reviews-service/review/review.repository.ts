import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Review } from "./schemas/review.schema";
import { Model, Types } from "mongoose";
import { SharedUtilsService } from "src/common/utils/shared-utils.service";
import { UploadService } from "src/api/upload-service/upload/upload.service";
import { ProductRepository } from "src/api/product-service/product/repository/product.repository";
import { CreateReviewDto } from "./dto/create-review.dto";
import { GetReviewDto } from "./dto/get-review.dto";

type MergedReviewDto = CreateReviewDto & Pick<Review, 'user' | 'is_purchased'>

@Injectable()
export class ReviewRepository {
    constructor(
        @InjectModel(Review.name) private reviewModel: Model<Review>,
        private readonly sharedUtilsService: SharedUtilsService,
        private readonly uploadService: UploadService,
        private readonly productRepository: ProductRepository,
    ) { }

    async create(userInputs: MergedReviewDto, uploadedFiles: Express.Multer.File[]) {
        await this.sharedUtilsService.executeTransaction(async (session) => {
            const images = await this.uploadService.createImage(uploadedFiles, session)

            await this.reviewModel.create([
                { ...userInputs, images }
            ], { session })

            await this.productRepository.findOneAndUpdateStatistic({
                query: {
                    ratings: {
                        count: 1,
                        average: userInputs.rate
                    }
                },
                productId: userInputs.product, session
            })
        })
    }

    async find(query: GetReviewDto): Promise<Review[]> {
        return this.reviewModel.find({ product: new Types.ObjectId(query.productId) }).lean()
    }
}