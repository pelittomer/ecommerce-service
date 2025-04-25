import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ClientSession, Model, Types } from "mongoose";
import { Address } from "./schemas/address.schema";
import { CreateAddressDto } from "./dto/create-address.dto";
import { SharedUtilsService } from "src/common/utils/shared-utils.service";

@Injectable()
export class AddressRepository {
    constructor(
        @InjectModel(Address.name) private addressModel: Model<Address>,
        private readonly sharedUtilsService: SharedUtilsService,
    ) { }

    private async unsetExistingDefaultAddress(userId: Types.ObjectId, session: ClientSession): Promise<void> {
        await this.addressModel.updateMany(
            { user: userId, is_default: true },
            { is_default: false },
            { session },
        );
    }

    async create(address: CreateAddressDto, userId: Types.ObjectId): Promise<void> {
        await this.sharedUtilsService.executeTransaction(async (session) => {
            // Set all existing default addresses for the user to false.
            await this.unsetExistingDefaultAddress(userId, session)
            // Create the new address.
            await this.addressModel.create(
                [{ ...address, user: userId }],
                { session },
            )
        })
    }

    async find(userId: Types.ObjectId): Promise<Address[]> {
        return await this.addressModel.find({ user: userId }).lean()
    }
    
}