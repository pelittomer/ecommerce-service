import { BadRequestException, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";

export const UploadReviewImage = () => UseInterceptors(FilesInterceptor('images', 5, {
    fileFilter: (req, file, callback) => {
        if (!file.mimetype.startsWith('image/')) {
            return callback(new BadRequestException('Only image files are allowed!'), false)
        }
        callback(null, true)
    },
    limits: {
        fileSize: 1024 * 1024 * 5, // 5 MB
    }
}))