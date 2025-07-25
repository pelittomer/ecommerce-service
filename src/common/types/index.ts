import { Types } from "mongoose";

export enum Role {
    Customer = "CUSTOMER",
    Seller = "SELLER",
    Admin = "ADMIN"
}
export interface UserInfo {
    userId: Types.ObjectId;
    username: string;
    roles: Role
}