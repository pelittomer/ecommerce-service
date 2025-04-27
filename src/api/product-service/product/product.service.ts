import { Injectable } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { Request } from 'express';
import { SharedUtilsService } from 'src/common/utils/shared-utils.service';
import { ProductUtilsService } from './utils/product-utils.service';
import { Types } from 'mongoose';

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
}
