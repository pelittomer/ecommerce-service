import { BadRequestException, Injectable } from '@nestjs/common';
import { CompanyRepository } from './company.repository';
import { CreateCompanyDto } from './dto/create-company.dto';
import { Request } from 'express';
import { SharedUtilsService } from 'src/common/utils/shared-utils.service';
import { Types } from 'mongoose';

@Injectable()
export class CompanyService {
    constructor(
        private readonly companyRepository: CompanyRepository,
        private readonly sharedUtilsService: SharedUtilsService,
    ) { }

    async createCompany(userInputs: CreateCompanyDto, req: Request, uploadedImage: Express.Multer.File): Promise<string> {
        const user = this.sharedUtilsService.getUserInfo(req)
        const userId = new Types.ObjectId(user.userId)

        if (!uploadedImage) {
            throw new BadRequestException('No image was uploaded. Please ensure you provide a valid image file.Image not found.')
        }

        const companyExists = await this.companyRepository.findByOrQuery({
            user: userId,
            name: userInputs.name,
            tax_id: userInputs.tax_id,
        })

        if (companyExists) {
            if (companyExists.user.equals(userId)) {
                throw new BadRequestException('This user already has a company assigned. Only one company can be linked to a user.')
            } else if (companyExists.name === userInputs.name) {
                throw new BadRequestException('A company with this name already exists. Please try a different name.')
            } else if (companyExists.tax_id === userInputs.tax_id) {
                throw new BadRequestException('A company with this tax ID already exists. Please enter a different tax ID.')
            }
        }

        await this.companyRepository.create(userId, userInputs, uploadedImage)

        return 'Your company has been successfully created.'
    }
}
