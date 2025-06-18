import { Request } from "express";
import { CreateCompanyDto } from "../dto/create-company.dto";
import { UpdateCompanyDto } from "../dto/update-company.dto";
import { CompanyDocument } from "../entities/types";
import { UpdateCompanyStatusDto } from "../dto/update-company-status.dto";
import { Types } from "mongoose";
import { Company } from "../entities/company.entity";

export interface CreateCompanyParams {
    payload: CreateCompanyDto;
    req: Request;
    uploadedImage: Express.Multer.File;
}
export interface UpdateCompanyParams {
    payload: UpdateCompanyDto;
    req: Request;
    uploadedImage: Express.Multer.File;
}
export interface UpdateCompanyStatusParams {
    payload: UpdateCompanyStatusDto;
    companyId: Types.ObjectId;
}
export type TFindCompany = Exclude<Company, 'tax_id' | 'tax_office' | 'rejection_reason'> | null;
export interface ICompanyService {
    createCompany(params: CreateCompanyParams): Promise<string>;
    updateCompany(params: UpdateCompanyParams): Promise<string>;
    getAuthenticatedCompany(req: Request): Promise<CompanyDocument | null>;
    updateCompanyStatus(params: UpdateCompanyStatusParams): Promise<string>;
    findCompany(companyId: Types.ObjectId): Promise<TFindCompany>;
    fetchAllCompany(): Promise<Company[]>;
}