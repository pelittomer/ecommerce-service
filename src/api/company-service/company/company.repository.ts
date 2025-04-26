import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Company } from "./schemas/company.schema";
import { Model, Types } from "mongoose";
import { UploadService } from "src/api/upload-service/upload/upload.service";
import { SharedUtilsService } from "src/common/utils/shared-utils.service";
import { CreateCompanyDto } from "./dto/create-company.dto";

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
                    logo: savedImage._id as Types.ObjectId
                }
            ], { session })
        })
    }
}