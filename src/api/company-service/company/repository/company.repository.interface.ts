import { Types } from "mongoose";
import { CreateCompanyDto } from "../dto/create-company.dto";
import { Company } from "../entities/company.entity";
import { CompanyDocument } from "../entities/types";
import { UpdateCompanyStatusDto } from "../dto/update-company-status.dto";

export interface CreateCompanyOptions {
    userId: Types.ObjectId;
    payload: CreateCompanyDto;
    uploadedImage: Express.Multer.File;
}
export interface FindByIdAndUpdateCompanyOptions {
    company: CompanyDocument;
    payload: Partial<Company>;
    uploadedImage: Express.Multer.File;
}
export interface FindCompanyByIdAndUpdateStatusOptions {
    companyId: Types.ObjectId;
    payload: UpdateCompanyStatusDto;
}
export type TFindCompanyByIdForCustomer = Exclude<Company, 'tax_id' | 'tax_office' | 'rejection_reason'> | null
export interface ICompanyRepository {
    findByOrQuery(queryFieds: Partial<Record<keyof Company, any>>): Promise<Company | null>;
    create(params: CreateCompanyOptions): Promise<void>;
    findOne(queryFieds: Partial<Company>): Promise<CompanyDocument | null>;
    findByIdAndUpdate(): Promise<void>;
    findById(companyId: Types.ObjectId): Promise<Company | null>;
    findCompanyByIdAndUpdateStatus(params: FindCompanyByIdAndUpdateStatusOptions): Promise<void>;
    findCompanyByIdForCustomer(companyId: Types.ObjectId): Promise<TFindCompanyByIdForCustomer>;
}