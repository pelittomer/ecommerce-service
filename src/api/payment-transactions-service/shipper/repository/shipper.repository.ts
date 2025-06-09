import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Shipper } from "../entities/shipper.entity";
import { Model } from "mongoose";
import { UploadService } from "src/api/upload-service/upload/upload.service";
import { SharedUtilsService } from "src/common/utils/shared-utils.service";
import { CreateShipperOptions, IShipperRepository } from "./shipper.repository.interface";

@Injectable()
export class ShipperRepository implements IShipperRepository {
    constructor(
        @InjectModel(Shipper.name) private shipperModel: Model<Shipper>,
        private readonly uploadService: UploadService,
        private readonly sharedUtilsService: SharedUtilsService,
    ) { }

    async findOne(queryFieds: Partial<Shipper>): Promise<Shipper | null> {
        return await this.shipperModel.findOne(queryFieds)
    }

    async create(params: CreateShipperOptions): Promise<void> {
        const { payload, uploadedImage } = params
        await this.sharedUtilsService.executeTransaction(async (session) => {
            const savedImage = await this.uploadService.createImage(uploadedImage, session)
            await this.shipperModel.create([{
                ...payload,
                logo: savedImage,
            }], { session })
        })
    }

    async find(): Promise<Exclude<Shipper, 'api_key'>[]> {
        return await this.shipperModel.find().select('-api_key').lean()
    }
}