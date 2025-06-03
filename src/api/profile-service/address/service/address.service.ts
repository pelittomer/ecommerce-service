import { Injectable } from '@nestjs/common';
import { AddressRepository } from '../repository/address.repository';
import { Request } from 'express';
import { SharedUtilsService } from 'src/common/utils/shared-utils.service';
import { Address } from '../entities/address.entity';
import { CreateAddressServiceParams, DeleteAddressServiceParams, IAddressService, UpdateAddressServiceParams } from './address.service.interface';
import { ADDRESS_MESSAGE } from '../constants/address.message';

@Injectable()
export class AddressService implements IAddressService {
    constructor(
        private readonly addressRepository: AddressRepository,
        private readonly sharedUtilsService: SharedUtilsService,
    ) { }

    async createAddress(params: CreateAddressServiceParams): Promise<string> {
        const { payload, req } = params
        const userId = this.sharedUtilsService.getUserIdFromRequest(req)
        await this.addressRepository.create({ payload, userId })
        return ADDRESS_MESSAGE.ADDRESS_CREATED_SUCCESS
    }

    async findAddresses(req: Request): Promise<Address[]> {
        const userId = this.sharedUtilsService.getUserIdFromRequest(req)
        return await this.addressRepository.find(userId)
    }

    async updateAddressDefault(params: UpdateAddressServiceParams): Promise<string> {
        const { req, addressId } = params
        const userId = this.sharedUtilsService.getUserIdFromRequest(req)
        await this.addressRepository.update({ addressId, userId })
        return ADDRESS_MESSAGE.ADDRESS_UPDATED_SUCCESS
    }

    async deleteAddress(params: DeleteAddressServiceParams): Promise<string> {
        const { req, addressId } = params
        const userId = this.sharedUtilsService.getUserIdFromRequest(req)
        await this.addressRepository.findOneAndDelete({ addressId, userId })
        return ADDRESS_MESSAGE.ADDRESS_DELETED_SUCCESS
    }
}
