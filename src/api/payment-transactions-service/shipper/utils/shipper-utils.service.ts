import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { IShipperUtilsService } from "./shipper-utils.service.interface";
import { ShipperRepository } from "../repository/shipper.repository";
import { SHIPPER_MESSAGE } from "../constants/shipper.message";

@Injectable()
export class ShipperUtilsService implements IShipperUtilsService {
    constructor(
        private readonly shipperRepository: ShipperRepository
    ) { }

    validateImageUpload(uploadedImage: Express.Multer.File): void {
        if (!uploadedImage) {
            throw new BadRequestException(SHIPPER_MESSAGE.NO_IMAGE_UPLOADED)
        }
    }

    async validateShipperNameUniqueness(name: string): Promise<void> {
        const shipperExists = await this.shipperRepository.findOne({ name })
        if (shipperExists) {
            throw new ConflictException(SHIPPER_MESSAGE.NAME_ALREADY_IN_USE)
        }
    }
}