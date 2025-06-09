import { CreateShipperDto } from "../dto/create-shipper.dto";
import { TFindShippers } from "../repository/shipper.repository.interface";

export interface CreateShipperParams {
    payload: CreateShipperDto;
    uploadedImage: Express.Multer.File;
}
export interface IShipperService {
    createShipper(params: CreateShipperParams): Promise<string>;
    findShippers(): Promise<TFindShippers>;
}