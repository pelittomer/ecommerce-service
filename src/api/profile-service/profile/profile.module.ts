import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SharedUtilsModule } from 'src/common/utils/shared-utils.module';
import { UploadModule } from 'src/api/upload-service/upload/upload.module';
import { ProfileController } from './profile.controller';
import { ProfileService } from './service/proflie.service';
import { ProfileRepository } from './repository/profile.repository';
import { Profile, ProfileSchema } from './entities/profile.entity';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, ProfileRepository],
  imports: [
    MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema }]),
    SharedUtilsModule, UploadModule
  ],
  exports: [ProfileRepository]
})
export class ProfileModule { }
