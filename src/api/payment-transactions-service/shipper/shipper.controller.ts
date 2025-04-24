import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ShipperService } from './shipper.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/types';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('shipper')
export class ShipperController {
  constructor(private readonly shipperService: ShipperService) { }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post()
  createShipper() {
    /*
    This function adds a new shipping company to the system.
    */
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Seller)
  @Get()
  fetchShipper() {
    /*
    This function retrieves and lists the available shipping companies.
    */
  }

}
