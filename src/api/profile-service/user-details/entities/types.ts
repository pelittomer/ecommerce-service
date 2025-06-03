import { Document } from "mongoose";
import { UserDetails } from "./user-detail.entity";

export enum Gender {
    Male = "Male",
    Female = "Female",
    Other = "Other",
    PreferNotToSay = "PreferNotToSay"
}

export type UserDetailsDocument = UserDetails & Document;
