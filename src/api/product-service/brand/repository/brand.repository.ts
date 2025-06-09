import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Brand } from "../entities/brand.entity";
import { SharedUtilsService } from "src/common/utils/shared-utils.service";
import { UploadService } from "src/api/upload-service/upload/upload.service";
import { BrandDocument } from "../entities/types";
import { CreateBrandOptions, IBrandRepository } from "./brand.repository.interface";

@Injectable()
export class BrandRepository implements IBrandRepository {
    constructor(
        @InjectModel(Brand.name) private brandModel: Model<Brand>,
        private readonly sharedUtilsService: SharedUtilsService,
        private readonly uploadService: UploadService,
    ) { }

    async findExits(queryFieds: Partial<Brand>): Promise<Pick<BrandDocument, '_id'> | null> {
        return await this.brandModel.exists(queryFieds)
    }

    async create(params: CreateBrandOptions): Promise<void> {
        const { payload, uploadedImage } = params
        await this.sharedUtilsService.executeTransaction(async (session) => {
            const savedImage = await this.uploadService.createImage(uploadedImage, session)
            await this.brandModel.create({
                ...payload,
                logo: savedImage
            })
        })
    }

    async find(): Promise<Brand[]> {
        return await this.brandModel.find()
    }
}