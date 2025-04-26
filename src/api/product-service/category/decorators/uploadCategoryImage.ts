import { BadRequestException, UseInterceptors } from "@nestjs/common";
import { FileFieldsInterceptor } from "@nestjs/platform-express";

export const UploadCategoryImage = () => UseInterceptors(FileFieldsInterceptor([
    { name: 'image', maxCount: 1 },
    { name: 'icon', maxCount: 1 },
], {
    fileFilter: (req, file, callback) => {
        // Allow only image types
        if (!file.mimetype.startsWith('image/')) {
            return callback(new BadRequestException('Only image files are allowed!'), false);
        }
        callback(null, true);
    },
    limits: {
        fileSize: 1024 * 1024 * 5, // 5 MB
    }
}))