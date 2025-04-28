import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { Request } from 'express';
import { SharedUtilsService } from 'src/common/utils/shared-utils.service';
import { ProductUtilsService } from './utils/product-utils.service';
import { Types } from 'mongoose';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
    constructor(
        private readonly productRepository: ProductRepository,
        private readonly sharedUtilsService: SharedUtilsService,
        private readonly productUtilsService: ProductUtilsService,
    ) { }

    async createProduct(
        userInputs: CreateProductDto,
        req: Request,
        uploadedFiles: Record<string, Express.Multer.File[]>
    ) {
        const user = this.sharedUtilsService.getUserInfo(req)
        const company = await this.productUtilsService.validateUserCompany(user.userId)

        await this.productRepository.create(userInputs, uploadedFiles, company._id as Types.ObjectId)

        return 'Product successfully created.'
    }


    async updateProduct(
        userInputs: UpdateProductDto,
        req: Request,
        uploadedFiles: Record<string, Express.Multer.File[]>,
        productId: Types.ObjectId
    ) {
        const user = this.sharedUtilsService.getUserInfo(req)
        const company = await this.productUtilsService.validateUserCompany(user.userId)

        const { product, productDetails } = await this.productRepository.findProductAndDetails(productId, company._id as Types.ObjectId)
        if (!product || !productDetails) {
            throw new NotFoundException('Product not found!')
        }

        userInputs.images = userInputs.images?.map((image) => new Types.ObjectId(image))
        
        await this.productRepository.update(
            product,
            productDetails,
            uploadedFiles,
            userInputs,
            productId
        )
        return 'Product successfully updated.'
    }
}
