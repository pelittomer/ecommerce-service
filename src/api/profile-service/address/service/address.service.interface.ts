import { Request } from "express";
import { CreateAddressDto } from "../dto/create-address.dto";
import { Address } from "../entities/address.entity";
import { Types } from "mongoose";

export interface CreateAddressServiceParams {
    payload: CreateAddressDto;
    req: Request;
}
export interface UpdateAddressServiceParams {
    req: Request;
    addressId: Types.ObjectId;
}
export interface DeleteAddressServiceParams extends UpdateAddressServiceParams { }
export interface IAddressService {
    createAddress(params: CreateAddressServiceParams): Promise<string>;
    findAddresses(req: Request): Promise<Address[]>;
    updateAddressDefault(params: UpdateAddressServiceParams): Promise<string>;
    deleteAddress(params: DeleteAddressServiceParams): Promise<string>;
}