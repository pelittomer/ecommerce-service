import { Injectable } from '@nestjs/common';
import { ShipperRepository } from '../repository/shipper.repository';
import { randomBytes } from 'crypto';
import { CreateShipperParams, IShipperService } from './shipper.service.interface';
import { ShipperUtilsService } from '../utils/shipper-utils.service';
import { SHIPPER_MESSAGE } from '../constants/shipper.message';
import { TFindShippers } from '../repository/shipper.repository.interface';

@Injectable()
export class ShipperService implements IShipperService {
    constructor(
        private readonly shipperRepository: ShipperRepository,
        private readonly shipperUtilsService: ShipperUtilsService,
    ) { }

    async createShipper(params: CreateShipperParams): Promise<string> {
        const { payload, uploadedImage } = params
        this.shipperUtilsService.validateImageUpload(uploadedImage)

        await this.shipperUtilsService.validateShipperNameUniqueness(payload.name)

        const api_key = randomBytes(32).toString('hex')
        await this.shipperRepository.create({ payload: { ...payload, api_key }, uploadedImage })

        return SHIPPER_MESSAGE.SHIPPER_CREATED_SUCCESS
    }

    async findShippers(): Promise<TFindShippers> {
        return await this.shipperRepository.find()
    }
}
