import { Shipper } from "../entities/shipper.entity";

export interface CreateShipperOptions {
    payload: Partial<Shipper>;
    uploadedImage: Express.Multer.File;
}
export type TFindShippers = Exclude<Shipper, 'api_key'>[]
export interface IShipperRepository {
    findOne(queryFields: Partial<Shipper>): Promise<Shipper | null>;
    create(params: CreateShipperOptions): Promise<void>;
    find(): Promise<TFindShippers>;
}