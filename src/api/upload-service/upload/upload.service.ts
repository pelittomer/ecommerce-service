import { Injectable, NotFoundException } from '@nestjs/common';
import { UploadRepository } from './upload.repository';
import { ClientSession, Types } from 'mongoose';
import * as sharp from 'sharp';
import { CreateUploadDto } from './dto/create-upload.dto';
import { Response } from 'express';

@Injectable()
export class UploadService {
    constructor(
        private readonly uploadRepository: UploadRepository
    ) { }

    async findImage(imageId: Types.ObjectId, res: Response) {
        const imageRecord = await this.uploadRepository.findById(imageId)

        if (!imageRecord) {
            throw new NotFoundException('Image not found.')
        }

        const imageBuffer = Buffer.from(imageRecord.fileContent, 'base64')

        res.set('Content-Type', imageRecord.fileType)
        res.send(imageBuffer)
    }

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
