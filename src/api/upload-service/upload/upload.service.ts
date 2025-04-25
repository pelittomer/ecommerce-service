import { Injectable } from '@nestjs/common';
import { UploadRepository } from './upload.repository';
import { ClientSession, Types } from 'mongoose';
import * as sharp from 'sharp';
import { CreateUploadDto } from './dto/create-upload.dto';

@Injectable()
export class UploadService {
    constructor(
        private readonly uploadRepository: UploadRepository
    ) { }

    async createImage(uploadedImage: Express.Multer.File, session: ClientSession) {
        const compressedImageBuffer = await sharp(uploadedImage.buffer)
            .resize({ width: 1200, withoutEnlargement: true })
            .webp({ quality: 75 })
            .toBuffer()

        const encodedFileContent = compressedImageBuffer.toString('base64')

        const uploadData: CreateUploadDto = {
            filename: uploadedImage.originalname,
            fileContent: encodedFileContent,
            fileType: uploadedImage.mimetype
        }

        return await this.uploadRepository.create(uploadData, session)
    }

    async updateExistingImage(uploadedImage: Express.Multer.File, imageId: Types.ObjectId, session: ClientSession) {
        const compressedImageBuffer = await sharp(uploadedImage.buffer)
            .resize({ width: 1200, withoutEnlargement: true })
            .webp({ quality: 75 })
            .toBuffer()

        const encodedFileContent = compressedImageBuffer.toString('base64')

        const uploadData: CreateUploadDto = {
            filename: uploadedImage.originalname,
            fileContent: encodedFileContent,
            fileType: uploadedImage.mimetype
        }

        return await this.uploadRepository.findByIdAndUpdate(uploadData, imageId, session)
    }

}
