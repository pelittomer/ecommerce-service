import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Types } from "mongoose";
import { CompanyRepository } from "src/api/company-service/company/company.repository";
import { UploadService } from "src/api/upload-service/upload/upload.service";
import { CompanyStatus } from "src/common/types";
import { UpdateProductDto } from "../dto/update-product.dto";
import { GetDeleteImageIdsParams, IProductUtilsService, ProcessCriteriaImagesParams, SaveUploadedImagesParams, ValidateAndGroupUploadedFilesParams } from "./product-utils.service.interface";
import { CompanyDocument } from "src/api/company-service/company/schemas/company.schema";
import { PRODUCT_MESSAGE } from "../constants/product.message";

@Injectable()
export class ProductUtilsService implements IProductUtilsService {
    constructor(
        private readonly uploadService: UploadService,
        private readonly companyRepository: CompanyRepository,
    ) { }

    validateAndGroupUploadedFiles(params: ValidateAndGroupUploadedFilesParams): Record<string, Express.Multer.File[]> {
        const { files, requireFiles } = params
        if (requireFiles && (!files?.length)) {
            throw new BadRequestException(PRODUCT_MESSAGE.IMAGE_UPLOAD_FAILED_NO_IMAGE)
        }

        return files.reduce((uploadedFiles: Record<string, Express.Multer.File[]>, file) => {
            if (!file.mimetype.startsWith('image/')) {
                throw new BadRequestException(PRODUCT_MESSAGE.IMAGE_UPLOAD_ONLY_IMAGES_ALLOWED)
            }

            if (file.size > 5 * 1024 * 1024) {
                throw new BadRequestException(PRODUCT_MESSAGE.IMAGE_UPLOAD_FILE_TOO_LARGE(file.originalname))
            }

            (uploadedFiles[file.fieldname] ||= []).push(file)
            return uploadedFiles;
        }, {})
    }

    async validateUserCompany(userId: Types.ObjectId): Promise<CompanyDocument> {
        const company = await this.companyRepository.findOne({ user: new Types.ObjectId(userId) })
        if (!company) {
            throw new NotFoundException(PRODUCT_MESSAGE.COMPANY_NOT_CREATED)
        }
        if (company.status !== CompanyStatus.Approved) {
            throw new BadRequestException(PRODUCT_MESSAGE.COMPANY_NOT_APPROVED)
        }
        return company
    }

    processCriteriaImages(params: ProcessCriteriaImagesParams): UpdateProductDto['criteria'] {
        const { criteria, images } = params
        return criteria?.map((criterion) => ({
            ...criterion,
            options: criterion.options.map((option) => ({
                ...option,
                images: images[String(option.option)],
            })),
        }))
    }

    async saveUploadedImages(params: SaveUploadedImagesParams): Promise<Record<string, Types.ObjectId[]>> {
        const { session, uploadedFiles } = params
        const images = await Promise.all(
            Object.entries(uploadedFiles).map(async ([uploadKey, files]) => {
                const savedImageIds = await Promise.all(
                    files.map(async (file) => (await this.uploadService.createImage(file, session)))
                )
                return [uploadKey, savedImageIds]
            })
        )
        return Object.fromEntries(images)
    }

    getDeleteImageIds(params: GetDeleteImageIdsParams): Types.ObjectId[] {
        const { productDetails, products, payload } = params
        const deleteImageIds: Types.ObjectId[] = [];
        const inputsImageIds = payload.images?.map((img) => img._id);
        deleteImageIds.push(
            ...products.images.filter((img) => !inputsImageIds?.includes(img._id))
                .map((img) => img._id)
        )

        const userCriteriaImageIds = payload.criteria?.flatMap((criteria) => criteria.options.flatMap((option) => option.images || []))

        productDetails.criteria.forEach((criteria) => {
            criteria.options.forEach((option) => {
                if (option.images) {
                    deleteImageIds.push(
                        ...option.images.filter((img) => !userCriteriaImageIds?.includes(img._id))
                            .map((img) => img._id)
                    )
                }
            })
        })
        return deleteImageIds
    }
}
