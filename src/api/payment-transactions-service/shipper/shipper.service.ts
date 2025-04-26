import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateShipperDto } from './dto/create-shipper.dto';
import { ShipperRepository } from './shipper.repository';
import { randomBytes } from 'crypto';

@Injectable()
export class ShipperService {
    constructor(
        private readonly shipperRepository: ShipperRepository
    ) { }

    async createShipper(userInputs: CreateShipperDto, uploadedImage: Express.Multer.File): Promise<string> {
        if (!uploadedImage) {
            throw new BadRequestException('No image was uploaded. Please ensure you provide a valid image file.Image not found.')
        }

        const shipperExists = await this.shipperRepository.findOne({ name: userInputs.name })
        if (shipperExists) {
            throw new BadRequestException('This company name is already in use. Please use another company name.')
        }

        const api_key = randomBytes(32).toString('hex')
        await this.shipperRepository.create({ ...userInputs, api_key }, uploadedImage)

        return 'Your company has been successfully created.'
    }
}
