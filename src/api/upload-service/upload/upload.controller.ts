import { Controller, Get, Param, Res } from '@nestjs/common';
import { UploadService } from './upload.service';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Response } from 'express';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }

  @Get(':id')
  fetchImage(
    @Param('id', ParseObjectIdPipe) imageId: Types.ObjectId,
    @Res() res: Response
  ) {
    return this.uploadService.findImage(imageId, res)
  }

}
