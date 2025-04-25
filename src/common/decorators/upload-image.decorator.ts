import { BadRequestException, UseInterceptors } from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"


export const UploadImage = () => UseInterceptors(FileInterceptor('image', {
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