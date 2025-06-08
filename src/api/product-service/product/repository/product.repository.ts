import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Product } from "../entities/product.entity";
import { ProductDetail } from "../entities/product-details.entity";
import { ProductStock } from "../entities/product-stock.entity";
import { ProductStatistic } from "../entities/product-statistic.entity";
import { Model, Types } from "mongoose";
import { SharedUtilsService } from "src/common/utils/shared-utils.service";
import { ProductUtilsService } from "../utils/product-utils.service";
import { UploadRepository } from "src/api/upload-service/upload/upload.repository";
import { BulkUpdateStocksOptions, CreateProductOptions, FindOneAndUpdateStatisticOptions, FindProductAndDetailsOptions, FindProductExistsOptions, FindProductOptions, IProductRepository, TFindProduct, TFindProductAndDetails, TFindProductExists, TProductFindOne, UpdateManyProductStatisticOptions, UpdateProductOptions } from "./product.repository.interface";
import { BulkWriteResult } from 'mongodb';
import { ProductDocument } from "../entities/types";

@Injectable()
export class ProductRepository implements IProductRepository {
    constructor(
        @InjectModel(Product.name) private productModel: Model<Product>,
        @InjectModel(ProductDetail.name) private productDetailModel: Model<ProductDetail>,
        @InjectModel(ProductStock.name) private productStockModel: Model<ProductStock>,
        @InjectModel(ProductStatistic.name) private productStatisticModel: Model<ProductStatistic>,
        private readonly sharedUtilsService: SharedUtilsService,
        private readonly productUtilsService: ProductUtilsService,
        private readonly uploadRepository: UploadRepository,
    ) { }

    async create(params: CreateProductOptions): Promise<void> {
        const { payload, uploadedFiles, companyId } = params
        const {
            //product data
            name, price, brand, shipper, category,
            //product details data
            description, short_description, features, criteria
        } = payload

        await this.sharedUtilsService.executeTransaction(async (session) => {
            const images = await this.productUtilsService.saveUploadedImages({ uploadedFiles, session })
            const processedCriteria = this.productUtilsService.processCriteriaImages({ criteria, images })

            const [product] = await this.productModel.create([{
                name, price,
                brand: new Types.ObjectId(brand),
                shipper: new Types.ObjectId(shipper),
                category: new Types.ObjectId(category),
                company: companyId,
                images: images.images
            }], { session })
            // Create the new address.
            const createProductDetail = await this.productDetailModel.create(
                [
                    {
                        description, short_description, features,
                        criteria: processedCriteria,
                        product: product._id
                    }
                ], { session })
            //stock-data
            const stockData = payload.stock.map((item) => ({
                ...item,
                product: product._id
            }))
            const insertStock = await this.productStockModel.insertMany(stockData, { session })

            const createStatistic = await this.productStatisticModel.create([
                { product: product._id }
            ], { session })

            await Promise.all([createProductDetail, insertStock, createStatistic])
        })
    }

    async findProductAndDetails(params: FindProductAndDetailsOptions): Promise<TFindProductAndDetails> {
        const { companyId, productId } = params
        const [product, productDetails] = await Promise.all([
            this.productModel.findOne({ company: companyId, _id: productId }),
            this.productDetailModel.findOne({ product: productId })
        ])
        return { product, productDetails }
    }

    async update(params: UpdateProductOptions): Promise<void> {
        const { product, productDetails, uploadedFiles, payload, productId } = params
        await this.sharedUtilsService.executeTransaction(async (session) => {
            const deleteImageIds = this.productUtilsService.getDeleteImageIds({ products: product, productDetails, payload })
            await this.uploadRepository.deleteMany(deleteImageIds, session)

            const images = await this.productUtilsService.saveUploadedImages({ uploadedFiles, session })
            payload.criteria = this.productUtilsService.processCriteriaImages({ criteria: payload.criteria, images })
            if (images.images) payload.images?.push(...images.images)

            const productPromise = this.productModel.findOneAndUpdate(
                { _id: productId },
                {
                    price: payload.price,
                    discount: payload.discount,
                    is_published: payload.is_published,
                    images: payload.images,
                    shipper: payload.shipper,
                }, { session })

            const productDetailsPromise = this.productDetailModel.findOneAndUpdate(
                { product: productId },
                {
                    description: payload.description,
                    short_description: payload.short_description,
                    features: payload.features,
                    criteria: payload.criteria,
                }, { session })

            const stockPromise = payload.stock?.map((stockItem) => {
                const { _id, ...updateData } = stockItem;
                const update = { ...updateData, product: productId };
                const query = _id ? { _id, product: productId } : { product: productId };

                return _id
                    ? this.productStockModel.findOneAndUpdate(query, update, { session })
                    : this.productStockModel.create([update], { session });
            })
            await Promise.all([productPromise, productDetailsPromise, ...(stockPromise ?? [])])
        })
    }

    async findOne(productId: Types.ObjectId): Promise<TProductFindOne> {
        const [products, productDetails, productStatistics, productStocks] = await Promise.all([
            this.productModel.findOne({ _id: productId })
                .populate('brand')
                .populate({ path: 'company', select: '-tax_id -tax_office' })
                .populate({ path: 'shipper', select: '-api_key' })
                .populate({ path: 'category', select: 'category image' })
                .lean(),

            this.productDetailModel.findOne({ product: productId })
                .populate('criteria.variation criteria.options.option')
                .lean(),

            this.productStatisticModel.findOne({ product: productId }).lean(),
            this.productStockModel.find({ product: productId }).lean(),
            this.findOneAndUpdateStatistic({
                query: { views: 1 },
                productId
            })
        ])

        return {
            products,
            productDetails,
            productStatistics,
            productStocks,
        }
    }

    async find(params: FindProductOptions): Promise<TFindProduct> {
        const { limit, startIndex, filter, sortCriteria } = params
        const [productsLength, products] = await Promise.all([
            this.productModel.countDocuments(filter),
            this.productModel.aggregate([
                { $match: filter },
                {
                    $lookup: {
                        from: 'reviews',
                        localField: '_id',
                        foreignField: 'product_id',
                        as: 'reviews',
                    },
                },
                {
                    $lookup: {
                        from: 'companies',
                        localField: 'company',
                        foreignField: '_id',
                        as: 'company',
                    },
                },
                {
                    $unwind: '$company',
                },
                {
                    $lookup: {
                        from: 'productstatistics',
                        localField: '_id',
                        foreignField: 'product',
                        as: 'product_statistics',
                    },
                },
                {
                    $unwind: '$company',
                },
                {
                    $lookup: {
                        from: 'brands',
                        localField: 'brand',
                        foreignField: '_id',
                        as: 'brand_details',
                    },
                },
                {
                    $unwind: '$brand_details',
                },
                {
                    $project: {
                        name: 1,
                        commentsCount: { $size: '$reviews' },
                        images: 1,
                        price: 1,
                        discount: 1,
                        statistics: '$product_statistics',
                        brand: '$brand_details',
                        company: {
                            _id: '$company._id',
                            name: '$company.name'
                        }
                    },
                },
                ...(Object.keys(sortCriteria).length > 0 ? [{ $sort: sortCriteria }] : []),
                { $skip: startIndex },
                { $limit: limit },
            ]),
        ])

        return { productsLength, products }
    }

    async findProductExists(queryFields: FindProductExistsOptions): Promise<TFindProductExists> {
        return await this.productModel.exists(queryFields)
    }

    async findOneAndUpdateStatistic(params: FindOneAndUpdateStatisticOptions): Promise<void> {
        const { query, productId, session } = params
        const objectProductId = new Types.ObjectId(productId)
        if (query.ratings) {
            const { average: rate } = query.ratings
            // Find or create product statistics
            let productStatistic = await this.productStatisticModel.findOne({ product: objectProductId })
            if (!productStatistic) {
                productStatistic = new this.productStatisticModel({
                    product: objectProductId,
                    ratings: {
                        count: 0,
                        average: 0,
                    },
                })
            }
            // Update ratings count and average
            const currentCount = productStatistic.ratings.count
            // Calculate new average
            if (currentCount === 0) {
                productStatistic.ratings.count += 1
                productStatistic.ratings.average = rate
            } else {
                productStatistic.ratings.count += 1
                productStatistic.ratings.average = (productStatistic.ratings.average * currentCount + rate) / productStatistic.ratings.count
            }
            // Save updated product statistics
            await productStatistic.save({ session })
        } else {
            await this.productStatisticModel.findOneAndUpdate(
                { product: objectProductId },
                { $inc: query },
                { session }
            )
        }
    }

    async updateManyProductStatistic(params: UpdateManyProductStatisticOptions): Promise<void> {
        const { query, productIds, session } = params
        await this.productStatisticModel.updateMany(
            { product: { $in: productIds } },
            { $inc: query },
            { session }
        )
    }

    async findStockItemById(stockId: Types.ObjectId): Promise<ProductStock | null> {
        return await this.productStockModel.findById(stockId)
    }

    async findById(productId: Types.ObjectId): Promise<ProductDocument | null> {
        return this.productModel.findById(productId)
    }

    async bulkUpdateStocks(params: BulkUpdateStocksOptions): Promise<BulkWriteResult> {
        const { queryFields, session } = params
        return await this.productStockModel.bulkWrite(queryFields, { session })
    }
}
