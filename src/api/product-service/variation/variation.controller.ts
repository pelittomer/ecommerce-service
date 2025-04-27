import { Body, Controller, Get, Post, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { VariationService } from './variation.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/types';
import { CreateVariationDto } from './dto/create-variation.dto';
import { GetVariationDto } from './dto/get-variation.dto';
import { Types } from 'mongoose';

@Controller('variation')
export class VariationController {
  constructor(private readonly variationService: VariationService) { }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post()
  createVariation(@Body() userInputs: CreateVariationDto) {
    return this.variationService.createVariation(userInputs)
  }

  @Get()
  fetchVariation(@Query(ValidationPipe) query: GetVariationDto) {
    return this.variationService.findVariation(query.categoryId as Types.ObjectId)
  }

}
