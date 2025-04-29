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

    async createImage(
        uploadedImage: Express.Multer.File | Express.Multer.File[],
        session?: ClientSession
    ): Promise<Types.ObjectId | Types.ObjectId[]> {
        if (Array.isArray(uploadedImage)) {
            const uploadPromises = uploadedImage.map(async (image) => {
                const compressedImageBuffer = await sharp(image.buffer)
                    .resize({ width: 1200, withoutEnlargement: true })
                    .webp({ quality: 75 })
                    .toBuffer()

                const encodedFileContent = compressedImageBuffer.toString('base64')

                return {
                    filename: image.originalname,
                    fileContent: encodedFileContent,
                    fileType: image.mimetype,
                } as CreateUploadDto
            })

            const uploadImages = await Promise.all(uploadPromises)
            const savedImages = await this.uploadRepository.insertMany(uploadImages, session)
            return savedImages.map((file) => file._id as Types.ObjectId)
        } else {
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

            const image = await this.uploadRepository.create(uploadData, session)
            return image._id as Types.ObjectId
        }
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
