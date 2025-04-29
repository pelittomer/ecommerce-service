import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Address, AddressSchema } from './schemas/address.schema';
import { AddressRepository } from './address.repository';
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
