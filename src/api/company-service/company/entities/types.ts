import { Document } from "mongoose";
import { Company } from "./company.entity";

export type CompanyDocument = Company & Document;

export enum CompanyStatus {
    Pending = "PENDING",
    Approved = "APPROVED",
    Rejected = "REJECTED"
}
