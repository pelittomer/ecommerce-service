import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { SharedUtilsService } from 'src/common/utils/shared-utils.service';
import { Types } from 'mongoose';
import { Favorite } from '../entities/favorite.entity';
import { FavoriteRepository } from '../repository/favorite.repository';
import { CreateFavoriteServiceParams, IFavoriteService, RemoveFavoriteServiceParams } from './favorite.service.interface';
import { FavoriteUtils } from '../utils/favorite.utils';
import { FAVORITE_MESSAGE } from '../constants/favorite.message';

@Injectable()
export class FavoriteService implements IFavoriteService {
    constructor(
        private readonly favoriteRepository: FavoriteRepository,
        private readonly sharedUtilsService: SharedUtilsService,
        private readonly favoriteUtils: FavoriteUtils,
    ) { }

    async createFavorite(params: CreateFavoriteServiceParams): Promise<string> {
        const { payload, req } = params
        const user = this.sharedUtilsService.getUserIdFromRequest(req)
        const product = new Types.ObjectId(payload.productId)

        await this.favoriteUtils.validateProductAndFavoriteExistence({ product, user })

        await this.favoriteRepository.create({ user, product })

        return FAVORITE_MESSAGE.PRODUCT_ADDED
    }

    async removeFavorite(params: RemoveFavoriteServiceParams): Promise<string> {
        const { favoriteId, req } = params
        const user = this.sharedUtilsService.getUserIdFromRequest(req)

        const favorite = await this.favoriteUtils.validateFavoriteOwnership({ favoriteId, user })

        await this.favoriteRepository.findByIdAndDelete(favorite)

        return FAVORITE_MESSAGE.PRODUCT_REMOVED
    }

    async findFavorites(req: Request): Promise<Favorite[]> {
        const user = this.sharedUtilsService.getUserIdFromRequest(req)
        return await this.favoriteRepository.find({ user })
    }

    async removeAllFavorites(req: Request): Promise<string> {
        const user = this.sharedUtilsService.getUserIdFromRequest(req)

        const favorites = await this.favoriteRepository.findExistFavorites({ user })
        const productIds = favorites.map((item) => item.product)

        await this.favoriteRepository.deleteMany({ payload: { user }, productIds })

        return FAVORITE_MESSAGE.ALL_PRODUCTS_REMOVED
    }
}
