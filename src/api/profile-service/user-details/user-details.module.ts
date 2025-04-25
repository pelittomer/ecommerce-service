import { Module } from '@nestjs/common';
import { UserDetailsService } from './user-details.service';
import { UserDetailsController } from './user-details.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDetails, UserDetailsSchema } from './schemas/user-detail.schema';
import { UserDetailsRepository } from './user-details.repository';
import { SharedUtilsModule } from 'src/common/utils/shared-utils.module';
import { UploadModule } from 'src/api/upload-service/upload/upload.module';

@Module({
  controllers: [UserDetailsController],
  providers: [UserDetailsService, UserDetailsRepository],
  imports: [
    MongooseModule.forFeature([{ name: UserDetails.name, schema: UserDetailsSchema }]),
    SharedUtilsModule, UploadModule
  ],
  exports: [UserDetailsRepository]
})
export class UserDetailsModule { }
