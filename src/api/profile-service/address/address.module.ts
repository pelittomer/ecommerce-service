import { Module } from '@nestjs/common';
import { AddressService } from './service/address.service';
import { AddressController } from './address.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Address, AddressSchema } from './entities/address.entity';
import { AddressRepository } from './repository/address.repository';
import { SharedUtilsModule } from 'src/common/utils/shared-utils.module';

@Module({
  controllers: [AddressController],
  providers: [AddressService, AddressRepository],
  imports: [
    MongooseModule.forFeature([{ name: Address.name, schema: AddressSchema }]),
    SharedUtilsModule
  ],
  exports: [AddressRepository]
})
export class AddressModule { }
