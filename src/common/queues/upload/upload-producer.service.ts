import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import amqp, { ChannelWrapper } from "amqp-connection-manager";
import { Channel, Options } from "amqplib"
import { Types } from "mongoose";

export interface TUploadData {
    imageId: Types.ObjectId;
    uploadedImage: Express.Multer.File;
}

@Injectable()
export class UploadProducerService {
    private readonly logger = new Logger(UploadProducerService.name)
    private channelWrapper: ChannelWrapper

    constructor() {
        const connection = amqp.connect(['amqp://localhost'])
        this.channelWrapper = connection.createChannel({
            setup: (channel: Channel) => {
                return channel.assertQueue('uploadQueue', { durable: true })
            }
        })
    }

    async uploadImage(uploadData: TUploadData) {
        try {
            const options: Options.Publish = {
                persistent: true,
            };
            await this.channelWrapper.sendToQueue(
                'uploadQueue',
                Buffer.from(JSON.stringify(uploadData)),
                options
            )
            this.logger.warn('Sent to Queue.')
        } catch (error) {
            throw new HttpException(
                'Error adding file to queue',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }
}