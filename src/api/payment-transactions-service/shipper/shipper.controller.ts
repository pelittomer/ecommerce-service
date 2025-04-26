import { Body, Controller, Get, Post, UploadedFile, UseGuards } from '@nestjs/common';
import { ShipperService } from './shipper.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/types';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UploadImage } from 'src/common/decorators/upload-image.decorator';
import { CreateShipperDto } from './dto/create-shipper.dto';

@Controller('shipper')
export class ShipperController {
  constructor(private readonly shipperService: ShipperService) { }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post()
  @UploadImage()
  createShipper(
    @Body() userInputs: CreateShipperDto,
    @UploadedFile() uploadedImage: Express.Multer.File
  ) {
    return this.shipperService.createShipper(userInputs, uploadedImage)
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
