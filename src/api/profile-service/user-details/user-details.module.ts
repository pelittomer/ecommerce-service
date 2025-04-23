import { Module } from '@nestjs/common';
import { UserDetailsService } from './user-details.service';
import { UserDetailsController } from './user-details.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDetails, UserDetailsSchema } from './schemas/user-detail.schema';
import { UserDetailsRepository } from './user-details.repository';

@Module({
  controllers: [UserDetailsController],
  providers: [UserDetailsService, UserDetailsRepository],
  imports: [
    MongooseModule.forFeature([{ name: UserDetails.name, schema: UserDetailsSchema }]),
  ]
})
export class UserDetailsModule { }
