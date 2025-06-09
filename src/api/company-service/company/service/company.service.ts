import { Injectable } from '@nestjs/common';
import { CompanyRepository } from '../repository/company.repository';
import { Request } from 'express';
import { SharedUtilsService } from 'src/common/utils/shared-utils.service';
import { Types } from 'mongoose';
import { CompanyDocument } from '../entities/types';
import { CompanyUtilsService } from '../utils/company-utils.service';
import { COMPANY_MESSAGE } from '../constants/company.message';
import { CreateCompanyParams, ICompanyService, TFindCompany, UpdateCompanyParams, UpdateCompanyStatusParams } from './company.service.interface';

@Injectable()
export class CompanyService implements ICompanyService {
    constructor(
        private readonly companyRepository: CompanyRepository,
        private readonly sharedUtilsService: SharedUtilsService,
        private readonly companyUtilsService: CompanyUtilsService,
    ) { }

    async createCompany(params: CreateCompanyParams): Promise<string> {
        const { payload, req, uploadedImage } = params
        const userId = this.sharedUtilsService.getUserIdFromRequest(req)

        this.companyUtilsService.validateImageUpload(uploadedImage)

        await this.companyUtilsService.validateCompanyUniqueness({ userId, companyName: payload.name, taxId: payload.tax_id })

        await this.companyRepository.create({ userId, payload, uploadedImage })

        return COMPANY_MESSAGE.COMPANY_CREATED_SUCCESS
    }

    async updateCompany(params: UpdateCompanyParams): Promise<string> {
        const { req, uploadedImage, payload } = params
        const userId = this.sharedUtilsService.getUserIdFromRequest(req)

        const company = await this.companyUtilsService.getAndValidateUserCompany(userId)

        await this.companyRepository.findByIdAndUpdate({
            company,
            payload,
            uploadedImage
        })

        return COMPANY_MESSAGE.COMPANY_UPDATE_SUCCESS
    }

    async getAuthenticatedCompany(req: Request): Promise<CompanyDocument | null> {
        const user = this.sharedUtilsService.getUserIdFromRequest(req)
        return await this.companyRepository.findOne({ user })
    }

    async updateCompanyStatus(params: UpdateCompanyStatusParams): Promise<string> {
        const { companyId, payload } = params
        await this.companyUtilsService.getCompanyById(companyId)
        await this.companyRepository.findCompanyByIdAndUpdateStatus({ companyId, payload })
        return COMPANY_MESSAGE.COMPANY_STATUS_UPDATE_SUCCESS
    }

    async findCompany(companyId: Types.ObjectId): Promise<TFindCompany> {
        return this.companyRepository.findCompanyByIdForCustomer(companyId)
    }
}
