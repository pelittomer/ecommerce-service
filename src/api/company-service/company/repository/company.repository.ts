import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Company } from "../entities/company.entity";
import { Model, Types } from "mongoose";
import { UploadService } from "src/api/upload-service/upload/upload.service";
import { SharedUtilsService } from "src/common/utils/shared-utils.service";
import { CompanyDocument, CompanyStatus } from "../entities/types";
import { CreateCompanyOptions, FindByIdAndUpdateCompanyOptions, FindCompanyByIdAndUpdateStatusOptions, TFindCompanyByIdForCustomer } from "./company.repository.interface";

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

    async create(params: CreateCompanyOptions): Promise<void> {
        const { payload, uploadedImage, userId } = params
        await this.sharedUtilsService.executeTransaction(async (session) => {
            const savedImage = await this.uploadService.createImage(uploadedImage, session)
            await this.companyModel.create([
                {
                    ...payload,
                    user: userId,
                    logo: savedImage
                }
            ], { session })
        })
    }

    async findOne(queryFieds: Partial<Company>): Promise<CompanyDocument | null> {
        return await this.companyModel.findOne(queryFieds)
    }

    async findByIdAndUpdate(params: FindByIdAndUpdateCompanyOptions): Promise<void> {
        const { company, payload, uploadedImage } = params
        if (uploadedImage && company && company.logo) {
            await this.uploadService.updateExistingImage(uploadedImage, company.logo)
        }
        await this.companyModel.findByIdAndUpdate(company._id, payload)
    }

    async findById(companyId: Types.ObjectId): Promise<Company | null> {
        return await this.companyModel.findById(companyId).lean()
    }

    async findCompanyByIdAndUpdateStatus(params: FindCompanyByIdAndUpdateStatusOptions): Promise<void> {
        const { companyId, payload } = params
        await this.companyModel.findByIdAndUpdate(companyId, payload)
    }

    async findCompanyByIdForCustomer(companyId: Types.ObjectId): Promise<TFindCompanyByIdForCustomer> {
        return await this.companyModel.findById(companyId).select('-tax_id -tax_office -rejection_reason').lean()
    }

    async find(): Promise<Company[]> {
        return await this.companyModel.find().sort({ createdAt: -1 })
    }
}