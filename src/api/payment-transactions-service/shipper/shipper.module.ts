import { Module } from '@nestjs/common';
import { ShipperService } from './shipper.service';
import { ShipperController } from './shipper.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Shipper, ShipperSchema } from './schemas/shipper.schema';
import { ShipperRepository } from './shipper.repository';
import { UploadModule } from 'src/api/upload-service/upload/upload.module';
import { SharedUtilsModule } from 'src/common/utils/shared-utils.module';

@Module({
  controllers: [ShipperController],
  providers: [ShipperService, ShipperRepository],
  imports: [
    MongooseModule.forFeature([{ name: Shipper.name, schema: ShipperSchema }]),
    UploadModule,SharedUtilsModule
  ]
})
export class ShipperModule { }
