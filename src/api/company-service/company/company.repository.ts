import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Company, CompanyDocument } from "./schemas/company.schema";
import { Model, Types } from "mongoose";
import { UploadService } from "src/api/upload-service/upload/upload.service";
import { SharedUtilsService } from "src/common/utils/shared-utils.service";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { UpdateCompanyStatusDto } from "./dto/update-company-status.dto";

@Injectable()
export class CompanyRepository {
    constructor(
        @InjectModel(Company.name) private companyModel: Model<Company>,
        private readonly uploadService: UploadService,
        private readonly sharedUtilsService: SharedUtilsService,
    ) { }


    async findByOrQuery(queryFieds: Partial<Record<keyof Company, any>>): Promise<Company | null> {
        const orConditions = Object.keys(queryFieds).map(key => ({
            [key]: queryFieds[key]
        }))
        return await this.companyModel.findOne({ $or: orConditions }).lean()
    }


    async create(userId: Types.ObjectId, userInputs: CreateCompanyDto, uploadedImage: Express.Multer.File): Promise<void> {
        await this.sharedUtilsService.executeTransaction(async (session) => {
            const savedImage = await this.uploadService.createImage(uploadedImage, session)
            await this.companyModel.create([
                {
                    ...userInputs,
                    user: userId,
                    logo: savedImage
                }
            ], { session })
        })
    }

    async findOne(queryFieds: Partial<Company>): Promise<CompanyDocument | null> {
        return await this.companyModel.findOne(queryFieds)
    }

    async findByIdAndUpdate(company: CompanyDocument, userInputs: Partial<Company>, uploadedImage: Express.Multer.File): Promise<void> {
        await this.sharedUtilsService.executeTransaction(async (session) => {
            if (uploadedImage && company && company.logo) {
                await this.uploadService.updateExistingImage(uploadedImage, company.logo, session)
            }
            await this.companyModel.findByIdAndUpdate(
                company._id,
                userInputs,
                { session }
            )
        })
    }

    async findById(companyId: Types.ObjectId): Promise<Company | null> {
        return await this.companyModel.findById(companyId).lean()
    }

    async findCompanyByIdAndUpdateStatus(companyId: Types.ObjectId, userInputs: UpdateCompanyStatusDto): Promise<void> {
        await this.companyModel.findByIdAndUpdate(companyId, userInputs)
    }

    async findCompanyByIdForCustomer(companyId: Types.ObjectId): Promise<Exclude<Company, 'tax_id' | 'tax_office' | 'rejection_reason'> | null> {
        return await this.companyModel.findById(companyId).select('-tax_id -tax_office -rejection_reason').lean()
    }
}