import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CartRepository } from './cart.repository';
import { CreateCartDto } from './dto/create-cart.dto';
import { Request } from 'express';
import { SharedUtilsService } from 'src/common/utils/shared-utils.service';
import { Types } from 'mongoose';
import { ProductRepository } from 'src/api/product-service/product/product.repository';
import { Cart } from './schemas/cart.schema';

@Injectable()
export class CartService {
    constructor(
        private readonly cartRepository: CartRepository,
        private readonly productRepository: ProductRepository,
        private readonly sharedUtilsService: SharedUtilsService,
    ) { }

    async createCart(userInputs: CreateCartDto, req: Request): Promise<string> {
        const { product, product_stock, quantity } = userInputs

        const user = this.sharedUtilsService.getUserInfo(req)
        const userId = new Types.ObjectId(user.userId)
        const productObjectId = new Types.ObjectId(product)

        const [productExists, cartExists] = await Promise.all([
            this.productRepository.findProductExists({ _id: product }),
            this.cartRepository.findExists({ product: productObjectId, user: userId })
        ])

        if (!productExists) throw new NotFoundException('Product not found.')
        if (cartExists) throw new BadRequestException('This product is already in your carts.')

        const stockExists = await this.productRepository.findStockItemById(product_stock)
        if (!stockExists || stockExists.stock_quantity < quantity) {
            throw new BadRequestException('There is not enough stock for the requested quantity.')
        }

        await this.cartRepository.create({
            quantity,
            product: productObjectId,
            product_stock,
            user: userId
        })

        return 'Product successfully added to cart.'
    }

    async removeCart(cartId: Types.ObjectId, req: Request): Promise<string> {
        const user = this.sharedUtilsService.getUserInfo(req)
        const userId = new Types.ObjectId(user.userId)

        const cartExists = await this.cartRepository.findById(cartId)
        if (!cartExists?.user._id.equals(userId)) {
            throw new NotFoundException('Product not found.')
        }

        await this.cartRepository.findByIdAndDelete({ _id: cartId, user: userId, product: cartExists.product })

        return 'Product successfully removed from carts.'
    }

    async findCarts(req: Request): Promise<Cart[]> {
        const user = this.sharedUtilsService.getUserInfo(req)
        return await this.cartRepository.find({ user: new Types.ObjectId(user.userId) })
    }
}
