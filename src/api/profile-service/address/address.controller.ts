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
  fetchAddress(@Req() req: Request) {
    return this.addressService.findAddresses(req)
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer)
  @Put(':id')
  updateAddress(
    @Req() req: Request,
    @Param('id', ParseObjectIdPipe) addressId: Types.ObjectId
  ) {
    return this.addressService.updateAddressDefault(req, addressId)
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer)
  @Delete(':id')
  removeAddress(
    @Req() req: Request,
    @Param('id', ParseObjectIdPipe) addressId: Types.ObjectId
  ) {
    return this.addressService.deleteAddress(req, addressId)
  }

}
