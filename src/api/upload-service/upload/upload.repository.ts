import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Upload, UploadDocument } from "./schemas/upload.schema";
import { ClientSession, Model, Types } from "mongoose";
import { CreateUploadDto } from "./dto/create-upload.dto";

@Injectable()
export class UploadRepository {
    constructor(
        @InjectModel(Upload.name) private uploadModel: Model<Upload>,
    ) { }

    async findById(imageId: Types.ObjectId): Promise<Upload | null> {
        return await this.uploadModel.findById(imageId).lean()
    }

    async create(fields: object, session: ClientSession): Promise<UploadDocument> {
        const [newImage] = await this.uploadModel.create([fields], { session })
        return newImage
    }

    async findOneAndUpdate(uploadData: CreateUploadDto, imageId: Types.ObjectId): Promise<UploadDocument | null> {
        return await this.uploadModel.findOneAndUpdate({ _id: imageId }, uploadData, { upsert: true })
    }

    async deleteMany(imageIds: Types.ObjectId[], session: ClientSession): Promise<void> {
        await this.uploadModel.deleteMany({ _id: { $in: imageIds } }, { session })
    }

    async insertMany(fields: object[], session: ClientSession): Promise<UploadDocument[]> {
        return await this.uploadModel.insertMany(fields, { session })
    }
}