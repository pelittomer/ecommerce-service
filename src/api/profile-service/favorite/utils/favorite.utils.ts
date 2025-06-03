import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { FavoriteRepository } from "../repository/favorite.repository";
import { ProductRepository } from "src/api/product-service/product/product.repository";
import { IFavoriteUtils, ValidateFavoriteOwnershipParams, validateProductAndFavoriteExistenceParams } from "./favorite.utils.interface";
import { FavoriteDocument } from "../entities/types";
import { FAVORITE_MESSAGE } from "../constants/favorite.message";

@Injectable()
export class FavoriteUtils implements IFavoriteUtils {
    constructor(
        private readonly favoriteRepository: FavoriteRepository,
        private readonly productRepository: ProductRepository,
    ) { }

    async validateProductAndFavoriteExistence(params: validateProductAndFavoriteExistenceParams): Promise<void> {
        const { product, user } = params

        const [productExists, favoriteExists] = await Promise.all([
            this.productRepository.findProductExists({ _id: product }),
            this.favoriteRepository.findExists({ product, user }),
        ])

        if (!productExists) {
            throw new BadRequestException(FAVORITE_MESSAGE.PRODUCT_NOT_FOUND)
        }
        if (favoriteExists) {
            throw new BadRequestException(FAVORITE_MESSAGE.ALREADY_IN_FAVORITES)
        }
    }

    async validateFavoriteOwnership(params: ValidateFavoriteOwnershipParams): Promise<FavoriteDocument> {
        const { favoriteId, user } = params

        const favorite = await this.favoriteRepository.findById(favoriteId)
        if (!favorite || !favorite.user._id.equals(user)) {
            throw new NotFoundException(FAVORITE_MESSAGE.FAVORITE_NOT_FOUND_OR_UNAUTHORIZED)
        }
        
        return favorite
    }
}