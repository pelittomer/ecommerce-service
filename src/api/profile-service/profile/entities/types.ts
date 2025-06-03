import { Document } from "mongoose";
import { Profile } from "./profile.entity";

export enum Gender {
    Male = "Male",
    Female = "Female",
    Other = "Other",
    PreferNotToSay = "PreferNotToSay"
}

export type ProfileDocument = Profile & Document;
