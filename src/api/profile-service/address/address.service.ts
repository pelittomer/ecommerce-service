import { Injectable } from '@nestjs/common';
import { AddressRepository } from './address.repository';
import { CreateAddressDto } from './dto/create-address.dto';
import { Request } from 'express';
import { SharedUtilsService } from 'src/common/utils/shared-utils.service';
import { Types } from 'mongoose';
import { Address } from './schemas/address.schema';

@Injectable()
export class AddressService {
    constructor(
        private readonly addressRepository: AddressRepository,
        private readonly sharedUtilsService: SharedUtilsService,
    ) { }

    async createAddress(userInputs: CreateAddressDto, req: Request): Promise<string> {
        const user = this.sharedUtilsService.getUserInfo(req)
        const userId = new Types.ObjectId(user.userId)

        await this.addressRepository.create(userInputs, userId)

        return 'Address successfully created.'
    }

    async findAddresses(req: Request): Promise<Address[]> {
        const user = this.sharedUtilsService.getUserInfo(req)
        const userId = new Types.ObjectId(user.userId)

        return await this.addressRepository.find(userId)
    }

    async updateAddressDefault(req: Request, addressId: Types.ObjectId): Promise<string> {
        const user = this.sharedUtilsService.getUserInfo(req)
        const userId = new Types.ObjectId(user.userId)

        await this.addressRepository.update(addressId, userId)

        return 'Address successfully updated.'
    }

    async deleteAddress(req: Request, addressId: Types.ObjectId): Promise<string> {
        const user = this.sharedUtilsService.getUserInfo(req)
        const userId = new Types.ObjectId(user.userId)

        await this.addressRepository.delete(addressId, userId)

        return 'Address deleted and the last added address set as default.'
    }

}
