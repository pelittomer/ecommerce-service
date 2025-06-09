export interface IBrandUtilsService {
    validateBrandNameUniqueness(brandName: string): Promise<void>;
    validateImage(uploadedImage: Express.Multer.File): void;
}