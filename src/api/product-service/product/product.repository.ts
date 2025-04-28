import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Product, ProductDocument } from "./schemas/product.schema";
import { ProductDetail, ProductDetailDocument } from "./schemas/product-details.schema";
import { ProductStock } from "./schemas/product-stock.schema";
import { ProductStatistic } from "./schemas/product-statistic.schema";
import { Model, Types } from "mongoose";
import { CreateProductDto } from "./dto/create-product.dto";
import { SharedUtilsService } from "src/common/utils/shared-utils.service";
import { ProductUtilsService } from "./utils/product-utils.service";
import { UploadRepository } from "src/api/upload-service/upload/upload.repository";
import { UpdateProductDto } from "./dto/update-product.dto";

@Injectable()
export class ProductRepository {
    constructor(
        @InjectModel(Product.name) private productModel: Model<Product>,
        @InjectModel(ProductDetail.name) private productDetailModel: Model<ProductDetail>,
        @InjectModel(ProductStock.name) private productStockModel: Model<ProductStock>,
        @InjectModel(ProductStatistic.name) private productStatisticModel: Model<ProductStatistic>,
        private readonly sharedUtilsService: SharedUtilsService,
        private readonly productUtilsService: ProductUtilsService,
        private readonly uploadRepository: UploadRepository,
    ) { }

    async create(
        userInputs: CreateProductDto,
        uploadedFiles: Record<string, Express.Multer.File[]>,
        companyId: Types.ObjectId
    ) {
        const {
            //product data
            name, price, brand, shipper, category,
            //product details data
            description, short_description, features, criteria
        } = userInputs

        // Another potential point of timeout if creating product details, images, stock, or statistics takes too long.
        const images = await this.productUtilsService.saveUploadedImages(uploadedFiles)
        const processedCriteria = this.productUtilsService.processCriteriaImages(criteria, images)

        await this.sharedUtilsService.executeTransaction(async (session) => {
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
            const stockData = userInputs.stock.map((item) => ({
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

    async findProductAndDetails(productId: Types.ObjectId, companyId: Types.ObjectId) {
        const [product, productDetails] = await Promise.all([
            this.productModel.findOne({ company: companyId, _id: productId }),
            this.productDetailModel.findOne({ product: productId })
        ])
        return { product, productDetails }
    }

    async update(
        product: ProductDocument,
        productDetails: ProductDetailDocument,
        uploadedFiles: Record<string, Express.Multer.File[]>,
        userInputs: UpdateProductDto,
        productId: Types.ObjectId
    ) {
        await this.sharedUtilsService.executeTransaction(async (session) => {
            const deleteImageIds = this.productUtilsService.getDeleteImageIds(product, productDetails, userInputs)
            await this.uploadRepository.deleteMany(deleteImageIds, session)

            const images = await this.productUtilsService.saveUploadedImages(uploadedFiles, session)
            userInputs.criteria = this.productUtilsService.processCriteriaImages(userInputs.criteria, images)
            if (images.images) userInputs.images?.push(...images.images)

            const productPromise = this.productModel.findOneAndUpdate(
                { _id: productId },
                {
                    price: userInputs.price,
                    discount: userInputs.discount,
                    is_published: userInputs.is_published,
                    images: userInputs.images,
                    shipper: userInputs.shipper,
                }, { session })

            const productDetailsPromise = this.productDetailModel.findOneAndUpdate(
                { product: productId },
                {
                    description: userInputs.description,
                    short_description: userInputs.short_description,
                    features: userInputs.features,
                    criteria: userInputs.criteria,
                }, { session })

            const stockPromise = userInputs.stock?.map((stockItem) => {
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
}
