import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ShipperService } from './shipper.service';
import { CreateShipperDto } from './dto/create-shipper.dto';
import { UpdateShipperDto } from './dto/update-shipper.dto';

@Controller('shipper')
export class ShipperController {
  constructor(private readonly shipperService: ShipperService) {}

  @Post()
  create(@Body() createShipperDto: CreateShipperDto) {
    return this.shipperService.create(createShipperDto);
  }

  @Get()
  findAll() {
    return this.shipperService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shipperService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShipperDto: UpdateShipperDto) {
    return this.shipperService.update(+id, updateShipperDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shipperService.remove(+id);
  }
}
