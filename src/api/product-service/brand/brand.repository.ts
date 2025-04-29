import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Brand, BrandDocument } from "./schemas/brand.schema";
import { SharedUtilsService } from "src/common/utils/shared-utils.service";
import { CreateBrandDto } from "./dto/create-brand.dto";
import { UploadService } from "src/api/upload-service/upload/upload.service";

@Injectable()
export class BrandRepository {
    constructor(
        @InjectModel(Brand.name) private brandModel: Model<Brand>,
        private readonly sharedUtilsService: SharedUtilsService,
        private readonly uploadService: UploadService,
    ) { }

    async findExits(queryFieds: Partial<Brand>): Promise<Pick<BrandDocument, '_id'> | null> {
        return await this.brandModel.exists(queryFieds)
    }

    async create(userInputs: CreateBrandDto, uploadedImage: Express.Multer.File): Promise<void> {
        await this.sharedUtilsService.executeTransaction(async (session) => {
            const savedImage = await this.uploadService.createImage(uploadedImage, session)
            await this.brandModel.create({
                ...userInputs,
                logo: savedImage
            })
        })
    }

    async find(): Promise<Brand[]> {
        return await this.brandModel.find()
    }
}