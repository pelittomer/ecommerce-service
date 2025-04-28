import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Favorite, FavoriteDocument } from "./schemas/favorite.schema";
import { Model, Types } from "mongoose";
import { ProductRepository } from "src/api/product-service/product/product.repository";
import { SharedUtilsService } from "src/common/utils/shared-utils.service";

@Injectable()
export class FavoriteRepository {
    constructor(
        @InjectModel(Favorite.name) private favoriteModel: Model<Favorite>,
        private readonly productRepository: ProductRepository,
        private readonly sharedUtilsService: SharedUtilsService,
    ) { }

    async findExists(queryFields: Partial<Favorite>): Promise<Pick<FavoriteDocument, '_id'> | null> {
        return await this.favoriteModel.exists(queryFields)
    }

    async create(userInputs: Favorite): Promise<void> {
        await this.sharedUtilsService.executeTransaction(async (session) => {
            await this.favoriteModel.create([userInputs], { session })
            await this.productRepository.findOneAndUpdateStatistic({ favorites: 1 }, userInputs.product, session)
        })
    }

    async findById(favoriteId: Types.ObjectId): Promise<FavoriteDocument | null> {
        return await this.favoriteModel.findById(favoriteId)
    }

    async findByIdAndDelete(favorite: FavoriteDocument): Promise<void> {
        await this.sharedUtilsService.executeTransaction(async (session) => {
            await this.favoriteModel.findByIdAndDelete(favorite._id, { session })
            await this.productRepository.findOneAndUpdateStatistic({ favorites: -1 }, favorite.product, session)
        })
    }

    async find(queryFields: Partial<Favorite>): Promise<Favorite[]> {
        return await this.favoriteModel.find(queryFields)
            .sort({ createdAt: -1 })
            .populate({
                path: 'product',
                populate: [
                    { path: 'brand' },
                    { path: 'category', select: 'name' },
                    { path: 'company', select: 'name' },
                ]
            }).lean()
    }

    async findExistFavorites(queryFields: Partial<Favorite>): Promise<Pick<FavoriteDocument, '_id' | 'product'>[]> {
        return await this.favoriteModel.find(queryFields).select('product')
    }

    async deleteMany(queryFields: Partial<Favorite>, productIds: Types.ObjectId[]): Promise<void> {
        await this.sharedUtilsService.executeTransaction(async (session) => {
            await this.favoriteModel.deleteMany(queryFields, { session })
            await this.productRepository.updateManyProductStatistic({ favorites: -1 }, productIds, session)
        })
    }
}
