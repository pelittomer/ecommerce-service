import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Shipper } from "./schemas/shipper.schema";
import { Model } from "mongoose";
import { UploadService } from "src/api/upload-service/upload/upload.service";
import { SharedUtilsService } from "src/common/utils/shared-utils.service";

@Injectable()
export class ShipperRepository {
    constructor(
        @InjectModel(Shipper.name) private shipperModel: Model<Shipper>,
        private readonly uploadService: UploadService,
        private readonly sharedUtilsService: SharedUtilsService,
    ) { }

    async findOne(queryFieds: Partial<Shipper>): Promise<Shipper | null> {
        return await this.shipperModel.findOne(queryFieds)
    }

    async create(userInputs: Partial<Shipper>, uploadedImage: Express.Multer.File): Promise<void> {
        await this.sharedUtilsService.executeTransaction(async (session) => {
            const savedImage = await this.uploadService.createImage(uploadedImage, session)
            await this.shipperModel.create([{
                ...userInputs,
                logo: savedImage._id,
            }], { session })
        })
    }

}