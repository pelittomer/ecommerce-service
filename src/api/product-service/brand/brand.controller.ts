import { Body, Controller, Get, Post, UploadedFile, UseGuards } from '@nestjs/common';
import { BrandService } from './brand.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/types';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UploadImage } from 'src/common/decorators/upload-image.decorator';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) { }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post()
  @UploadImage()
  createBrand(
    @Body() userInputs: CreateBrandDto,
    @UploadedFile() uploadedImage: Express.Multer.File
  ) {
    return this.brandService.createBrand(userInputs, uploadedImage)
  }

  @Get()
  fetchBrands() {
    return this.brandService.findBrands()
  }
}
