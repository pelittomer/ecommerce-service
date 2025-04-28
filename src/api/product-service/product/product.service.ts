import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { Request } from 'express';
import { SharedUtilsService } from 'src/common/utils/shared-utils.service';
import { ProductUtilsService } from './utils/product-utils.service';
import { Types } from 'mongoose';
import { UpdateProductDto } from './dto/update-product.dto';
import { PartialGetProductDto } from './dto/get-product.dto';

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

    async findProductDetails(productId: Types.ObjectId) {
        return await this.productRepository.findOne(productId)
    }

    async findProducts(queryFields: PartialGetProductDto) {
        const limit = 30
        const page = queryFields.page || 1
        const startIndex = (page - 1) * limit
    
        let filter: any = {}
        let sortCriteria: any = {}
    
        if (queryFields.categoryId) {
          filter.category = new Types.ObjectId(queryFields.categoryId)
        }
        if (queryFields.q) {
          filter.name = { $regex: new RegExp(queryFields.q, 'i') };
        }
        if (queryFields.minPrice !== undefined && queryFields.maxPrice !== undefined) {
          filter.price = { $gte: queryFields.minPrice, $lte: queryFields.maxPrice }
        } else if (queryFields.minPrice !== undefined) {
          filter.price = { $gte: queryFields.minPrice }
        } else if (queryFields.maxPrice !== undefined) {
          filter.price = { $lte: queryFields.maxPrice }
        }
        if (queryFields.company) {
          filter.company = new Types.ObjectId(queryFields.company)
        }
        if (queryFields.brand) {
          filter.brand = new Types.ObjectId(queryFields.brand)
        }
        if (queryFields.sort) {
          const regex = /^(.*?)(?:_|$)(.*?)$/;
          const match = queryFields.sort.match(regex);
          if (match) {
            const [sortField, sortDirection] = match
            sortCriteria[sortField] = sortDirection === 'desc' ? -1 : 1
          }
        }
    
        return await this.productRepository.find(limit, startIndex, filter, sortCriteria)
    }
}
