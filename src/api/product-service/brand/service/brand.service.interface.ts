import { CreateBrandDto } from "../dto/create-brand.dto";
import { Brand } from "../entities/brand.entity";

export interface CreateBrandParams {
    payload: CreateBrandDto;
    uploadedImage: Express.Multer.File;
}
export interface IBrandService {
    createBrand(params: CreateBrandParams): Promise<string>;
    findBrands(): Promise<Brand[]>
}