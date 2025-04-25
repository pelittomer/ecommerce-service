import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AddressService } from './address.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/types';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { CreateAddressDto } from './dto/create-address.dto';
import { Request } from 'express';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) { }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer)
  @Post()
  createAddress(
    @Body() userInputs: CreateAddressDto,
    @Req() req: Request
  ) {
    return this.addressService.createAddress(userInputs, req)
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer)
  @Get()
  fetchAddress() {
    /*
    This function retrieves and returns all the addresses associated with a specific user.
    */
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer)
  @Put(':id')
  updateAddress(
    @Param('id', ParseObjectIdPipe) addressId: Types.ObjectId
  ) {
    /*
    This function updates a specific address belonging to the user, identified by the provided ID, and sets it as the default address.
    */
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer)
  @Delete(':id')
  removeAddress(
    @Param('id', ParseObjectIdPipe) addressId: Types.ObjectId
  ) {
    /*
    This function deletes a specific address belonging to the user, identified by the provided ID.
    */
  }

}
