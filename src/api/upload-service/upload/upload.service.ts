import { Injectable, NotFoundException } from '@nestjs/common';
import { UploadRepository } from './upload.repository';
import { ClientSession, Types } from 'mongoose';
import { Response } from 'express';
import { UploadProducerService } from 'src/common/queues/upload/upload-producer.service';

@Injectable()
export class UploadService {
    constructor(
        private readonly uploadRepository: UploadRepository,
        private uploadProducerService: UploadProducerService
    ) { }

    async findImage(imageId: Types.ObjectId, res: Response) {
        const imageRecord = await this.uploadRepository.findById(imageId)

        if (!imageRecord) throw new NotFoundException('Image not found.')

        const imageBuffer = Buffer.from(imageRecord.fileContent, 'base64')

        res.set('Content-Type', imageRecord.fileType)
        res.send(imageBuffer)
    }

    async createImage(
        uploadedImage: Express.Multer.File | Express.Multer.File[],
        session: ClientSession
    ): Promise<Types.ObjectId | Types.ObjectId[]> {
        if (Array.isArray(uploadedImage)) {
            const savedImages = await this.uploadRepository.insertMany(uploadedImage.map(() => ({})), session)
            const savedImageIds = savedImages.map((file) => file._id as Types.ObjectId)

            await Promise.all(
                savedImageIds.map((imageId, index) =>
                    this.uploadProducerService.uploadImage({
                        imageId, uploadedImage: uploadedImage[index]
                    }))
            )

            return savedImageIds
        } else {
            const image = await this.uploadRepository.create({}, session)
            await this.uploadProducerService.uploadImage({ imageId: image._id as Types.ObjectId, uploadedImage })
            return image._id as Types.ObjectId
        }
    }

    async updateExistingImage(uploadedImage: Express.Multer.File, imageId: Types.ObjectId) {
        await this.uploadProducerService.uploadImage({ imageId, uploadedImage })
    }
}
