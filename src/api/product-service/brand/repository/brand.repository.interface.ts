import { CreateBrandDto } from "../dto/create-brand.dto";
import { Brand } from "../entities/brand.entity";
import { BrandDocument } from "../entities/types";


export interface CreateBrandOptions {
    payload: CreateBrandDto;
    uploadedImage: Express.Multer.File;
}
export type TFindExistBrand = Pick<BrandDocument, '_id'> | null
export interface IBrandRepository {
    findExits(queryFieds: Partial<Brand>): Promise<TFindExistBrand>;
    create(params: CreateBrandOptions): Promise<void>;
    find(): Promise<Brand[]>
}