import { Injectable } from '@nestjs/common';
import { AddressRepository } from './address.repository';
import { CreateAddressDto } from './dto/create-address.dto';
import { Request } from 'express';
import { SharedUtilsService } from 'src/common/utils/shared-utils.service';
import { Types } from 'mongoose';

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
}
