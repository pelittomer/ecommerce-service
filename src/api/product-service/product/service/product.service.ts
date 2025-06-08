import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from '../repository/product.repository';
import { SharedUtilsService } from 'src/common/utils/shared-utils.service';
import { ProductUtilsService } from '../utils/product-utils.service';
import { Types } from 'mongoose';
import { PartialGetProductDto } from '../dto/get-product.dto';
import { CreateProductServiceParams, IProductService, UpdateProductServiceParams } from './product.service.interface';
import { PRODUCT_MESSAGE } from '../constants/product.message';
import { TFindProduct, TProductFindOne } from '../repository/product.repository.interface';

@Injectable()
export class ProductService implements IProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly sharedUtilsService: SharedUtilsService,
    private readonly productUtilsService: ProductUtilsService,
  ) { }

  async createProduct(params: CreateProductServiceParams): Promise<string> {
    const { payload, req, uploadedFiles } = params
    const user = this.sharedUtilsService.getUserInfo(req)
    const company = await this.productUtilsService.validateUserCompany(user.userId)

    await this.productRepository.create({
      payload,
      uploadedFiles,
      companyId: company._id as Types.ObjectId
    })

    return PRODUCT_MESSAGE.PRODUCT_CREATED_SUCCESS
  }


  async updateProduct(params: UpdateProductServiceParams): Promise<string> {
    const { payload, req, uploadedFiles, productId } = params
    const user = this.sharedUtilsService.getUserInfo(req)
    const company = await this.productUtilsService.validateUserCompany(user.userId)

    const { product, productDetails } = await this.productRepository.findProductAndDetails({
      productId,
      companyId: company._id as Types.ObjectId
    })
    if (!product || !productDetails) {
      throw new NotFoundException(PRODUCT_MESSAGE.PRODUCT_NOT_FOUND)
    }

    payload.images = payload.images?.map((image) => new Types.ObjectId(image))

    await this.productRepository.update({
      product,
      productDetails,
      uploadedFiles,
      payload,
      productId
    })
    return PRODUCT_MESSAGE.PRODUCT_UPDATED_SUCCESS
  }

  async findProductDetails(productId: Types.ObjectId): Promise<TProductFindOne> {
    return await this.productRepository.findOne(productId)
  }

  async findProducts(queryFields: PartialGetProductDto): Promise<TFindProduct> {
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

    return await this.productRepository.find({ limit, startIndex, filter, sortCriteria })
  }
}
