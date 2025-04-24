import { Controller, Get, Param } from '@nestjs/common';
import { UploadService } from './upload.service';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }

  @Get(':id')
  fetchImage(
    @Param('id', ParseObjectIdPipe) imageId: Types.ObjectId
  ) {
    /*
    This function retrieves and returns an image based on a provided image ID. It's used to fetch a specific image from the system's storage using its unique identifier.
     */
  }

}
