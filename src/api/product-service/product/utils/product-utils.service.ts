import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ClientSession, Types } from "mongoose";
import { CompanyRepository } from "src/api/company-service/company/company.repository";
import { UploadService } from "src/api/upload-service/upload/upload.service";
import { CompanyStatus } from "src/common/types";
import { UpdateProductDto } from "../dto/update-product.dto";
import { CreateProductDto } from "../dto/create-product.dto";
import { ProductDocument } from "../schemas/product.schema";
import { ProductDetailDocument } from "../schemas/product-details.schema";

@Injectable()
export class ProductUtilsService {
    constructor(
        private readonly uploadService: UploadService,
        private readonly companyRepository: CompanyRepository,
    ) { }

    validateAndGroupUploadedFiles(
        files: Express.Multer.File[],
        requireFiles: boolean = false
    ): Record<string, Express.Multer.File[]> {
        if (requireFiles && (!files?.length)) {
            throw new BadRequestException('Image upload failed. Please select at least one image.')
        }

        return files.reduce((uploadedFiles: Record<string, Express.Multer.File[]>, file) => {
            if (!file.mimetype.startsWith('image/')) {
                throw new BadRequestException('Only image files are allowed!')
            }

            if (file.size > 5 * 1024 * 1024) {
                throw new BadRequestException(`The file '${file.originalname}' is too large. Maximum file size is 5MB.`)
            }

            (uploadedFiles[file.fieldname] ||= []).push(file)
            return uploadedFiles;
        }, {})
    }

    async validateUserCompany(userId: Types.ObjectId) {
        const company = await this.companyRepository.findOne({ user: new Types.ObjectId(userId) })
        if (!company) {
            throw new NotFoundException('You have not created a company yet.')
        }
        if (company.status !== CompanyStatus.Approved) {
            throw new BadRequestException('Your company status is not approved. You cannot create products.')
        }
        return company
    }

    processCriteriaImages(criteria: UpdateProductDto['criteria'] | CreateProductDto['criteria'], images: Record<string, Types.ObjectId[]>): UpdateProductDto['criteria'] {
        return criteria?.map((criterion) => ({
            ...criterion,
            options: criterion.options.map((option) => ({
                ...option,
                images: images[String(option.option)],
            })),
        }))
    }

    async saveUploadedImages(
        uploadedFiles: Record<string, Express.Multer.File[]>,
        session?: ClientSession
    ): Promise<Record<string, Types.ObjectId[]>> {
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

    getDeleteImageIds(
        products: ProductDocument,
        productDetails: ProductDetailDocument,
        userInputs: UpdateProductDto): Types.ObjectId[] {
        const deleteImageIds: Types.ObjectId[] = [];
        const inputsImageIds = userInputs.images?.map((img) => img._id);
        deleteImageIds.push(
            ...products.images.filter((img) => !inputsImageIds?.includes(img._id))
                .map((img) => img._id)
        )

        const userCriteriaImageIds = userInputs.criteria?.flatMap((criteria) => criteria.options.flatMap((option) => option.images || []))

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
