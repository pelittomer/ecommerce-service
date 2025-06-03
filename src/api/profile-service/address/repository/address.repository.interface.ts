import { Types } from "mongoose";
import { CreateAddressDto } from "../dto/create-address.dto";
import { Address } from "../entities/address.entity";
import { AddressDocument } from "../entities/types";

export interface AddressCreateOptions {
    payload: CreateAddressDto;
    userId: Types.ObjectId;
}
export interface AddressUpdateOptions {
    addressId: Types.ObjectId;
    userId: Types.ObjectId;
}
export interface AddressFindOneAndDeleteOptions extends AddressUpdateOptions { }
export type AddressFindIsDefaultOptions = Pick<Address, 'user' | 'is_default'>

export interface IAddressRepository {
    create(params: AddressCreateOptions): Promise<void>;
    find(userId: Types.ObjectId): Promise<Address[]>;
    update(params: AddressUpdateOptions): Promise<void>;
    findOneAndDelete(params: AddressFindOneAndDeleteOptions): Promise<void>;
    findIsDefault(queryFields: AddressFindIsDefaultOptions): Promise<Pick<AddressDocument, '_id'> | null>
}