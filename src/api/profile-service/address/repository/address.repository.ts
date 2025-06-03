import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ClientSession, Model, Types } from "mongoose";
import { Address } from "../entities/address.entity";
import { SharedUtilsService } from "src/common/utils/shared-utils.service";
import { AddressDocument } from "../entities/types";
import { AddressCreateOptions, AddressFindIsDefaultOptions, AddressFindOneAndDeleteOptions, AddressUpdateOptions, IAddressRepository } from "./address.repository.interface";
import { ADDRESS_MESSAGE } from "../constants/address.message";

@Injectable()
export class AddressRepository implements IAddressRepository {
    constructor(
        @InjectModel(Address.name) private addressModel: Model<Address>,
        private readonly sharedUtilsService: SharedUtilsService,
    ) { }

    private async unsetExistingDefaultAddress(
        userId: Types.ObjectId,
        session: ClientSession
    ): Promise<void> {
        await this.addressModel.updateMany(
            { user: userId, is_default: true },
            { is_default: false },
            { session },
        );
    }

    async create(params: AddressCreateOptions): Promise<void> {
        const { payload, userId } = params
        await this.sharedUtilsService.executeTransaction(async (session) => {
            // Set all existing default addresses for the user to false.
            await this.unsetExistingDefaultAddress(userId, session)
            // Create the new address.
            await this.addressModel.create(
                [{ ...payload, user: userId }],
                { session },
            )
        })
    }

    async find(userId: Types.ObjectId): Promise<Address[]> {
        return await this.addressModel.find({ user: userId }).lean()
    }

    async update(params: AddressUpdateOptions): Promise<void> {
        const { userId, addressId } = params
        await this.sharedUtilsService.executeTransaction(async (session) => {
            // Set all existing default addresses for the user to false.
            await this.unsetExistingDefaultAddress(userId, session)
            // Create the new address.
            await this.addressModel.findOneAndUpdate(
                { _id: addressId, user: userId },
                { is_default: true },
                { session }
            )
        })
    }

    async findOneAndDelete(params: AddressFindOneAndDeleteOptions): Promise<void> {
        const { userId, addressId } = params
        await this.sharedUtilsService.executeTransaction(async (session) => {
            const deletedAddress = await this.addressModel.findOneAndDelete(
                { _id: addressId, user: userId },
                { session },
            )
            if (!deletedAddress) {
                throw new NotFoundException(ADDRESS_MESSAGE.ADDRESS_NOT_FOUND_OR_UNAUTHORIZED)
            }

            if (deletedAddress.is_default) {
                // Retrieve the user's addresses, sorted by creation date (newest first).
                const addresses = await this.addressModel
                    .find({ user: userId }, {}, { session })
                    .sort({ createdAt: -1 })
                    .limit(1)
                // If there are addresses, set the newest one as the default.
                if (addresses.length > 0) {
                    await this.addressModel.updateOne(
                        { _id: addresses[0]._id },
                        { is_default: true },
                        { session }
                    )
                }
            }
        })
    }

    async findIsDefault(
        queryFields: AddressFindIsDefaultOptions
    ): Promise<Pick<AddressDocument, '_id'> | null> {
        return await this.addressModel.exists(queryFields)
    }
}