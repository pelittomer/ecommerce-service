import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { VariationService } from './variation.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/types';

@Controller('variation')
export class VariationController {
  constructor(private readonly variationService: VariationService) { }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post()
  createVariation() {
    /*
    This function adds a new variation or filter option for products. For example, it could define a property like "color" with possible values such as "red," "yellow," and "white."
    */
  }

  @Get()
  fetchVariation() {
    /*
    This function retrieves and lists the available variation or filter options defined in the system.
    */
  }

}
