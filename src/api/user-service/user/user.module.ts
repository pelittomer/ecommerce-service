import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { UserRepository } from './repository/user.repository';
import { SharedUtilsModule } from 'src/common/utils/shared-utils.module';
import { ProfileModule } from 'src/api/profile-service/profile/profile.module';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ProfileModule, SharedUtilsModule
  ],
  exports: [UserRepository]
})
export class UserModule { }
