import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { ICompanyUtilsService, ValidateCompanyUniquenessParams } from "./company-utils.service.interface";
import { COMPANY_MESSAGE } from "../constants/company.message";
import { CompanyRepository } from "../repository/company.repository";
import { Types } from "mongoose";
import { CompanyDocument } from "../entities/types";
import { Company } from "../entities/company.entity";

@Injectable()
export class CompanyUtilsService implements ICompanyUtilsService {
    constructor(
        private readonly companyRepository: CompanyRepository,
    ) { }

    validateImageUpload(uploadedImage: Express.Multer.File): void {
        if (!uploadedImage) {
            throw new BadRequestException(COMPANY_MESSAGE.NO_IMAGE_UPLOADED)
        }
    }
    async validateCompanyUniqueness(params: ValidateCompanyUniquenessParams): Promise<void> {
        const { companyName, taxId, userId } = params
        const companyExists = await this.companyRepository.findByOrQuery({
            user: userId,
            name: companyName,
            tax_id: taxId,
        })

        if (companyExists) {
            if (companyExists.user.equals(userId)) {
                throw new ConflictException(COMPANY_MESSAGE.USER_ALREADY_HAS_COMPANY)
            }
            if (companyExists.name === companyName) {
                throw new ConflictException(COMPANY_MESSAGE.COMPANY_NAME_EXISTS)
            }
            if (companyExists.tax_id === taxId) {
                throw new ConflictException(COMPANY_MESSAGE.COMPANY_TAX_ID_EXISTS)
            }
            throw new ConflictException('A conflict occurred while creating the company.')
        }
    }

    async getAndValidateUserCompany(userId: Types.ObjectId): Promise<CompanyDocument> {
        const company = await this.companyRepository.findOne({ user: userId })
        if (!company) {
            throw new NotFoundException(COMPANY_MESSAGE.COMPANY_NOT_FOUND_FOR_USER)
        }
        return company
    }
    async getCompanyById(companyId: Types.ObjectId): Promise<Company> {
        const company = await this.companyRepository.findById(companyId)
        if (!company) {
            throw new NotFoundException(COMPANY_MESSAGE.COMPANY_NOT_FOUND)
        }
        return company
    }
}