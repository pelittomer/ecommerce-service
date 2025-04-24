import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { BrandService } from './brand.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/types';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) { }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post()
  createBrand() {
    /*
    This function adds a new brand to the system.
    */
  }

  @Get()
  fetchBrands() {
    /*
    This function retrieves and lists the available brands.
    */
  }

}
