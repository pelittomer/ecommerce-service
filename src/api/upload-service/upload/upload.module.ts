import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Upload, UploadSchema } from './schemas/upload.schema';
import { UploadRepository } from './upload.repository';
import { UploadQueueModule } from 'src/common/queues/upload/upload-queue.module';

@Module({
  controllers: [UploadController],
  providers: [UploadService, UploadRepository],
  imports: [
    MongooseModule.forFeature([{ name: Upload.name, schema: UploadSchema }]),
    UploadQueueModule
  ],
  exports: [UploadService, UploadRepository]
})
export class UploadModule { }
