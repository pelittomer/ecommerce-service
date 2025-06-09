export interface IShipperUtilsService {
    validateImageUpload(uploadedImage: Express.Multer.File): void;
    validateShipperNameUniqueness(name: string): Promise<void>
}