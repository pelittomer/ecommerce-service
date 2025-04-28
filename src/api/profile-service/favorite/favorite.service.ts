import { BadRequestException, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { FavoriteRepository } from './favorite.repository';
import { SharedUtilsService } from 'src/common/utils/shared-utils.service';
import { Types } from 'mongoose';
import { ProductRepository } from 'src/api/product-service/product/product.repository';

@Injectable()
export class FavoriteService {
    constructor(
        private readonly favoriteRepository: FavoriteRepository,
        private readonly sharedUtilsService: SharedUtilsService,
        private readonly productRepository: ProductRepository,
    ) { }

    async createFavorite(userInputs: CreateFavoriteDto, req: Request) {
        const user = this.sharedUtilsService.getUserInfo(req)
        const userId = new Types.ObjectId(user.userId)
        const productId = new Types.ObjectId(userInputs.productId)

        const [productExists, favoriteExists] = await Promise.all([
            this.productRepository.findProductExists({ _id: productId }),
            this.favoriteRepository.findExists({ product: productId, user: userId })
        ])
        if (!productExists) throw new BadRequestException('Product not found.')
        if (favoriteExists) throw new BadRequestException('This product is already in your favorites.')

        await this.favoriteRepository.create({ user: userId, product: productId })

        return 'Product successfully added to favorites.'
    }
}
