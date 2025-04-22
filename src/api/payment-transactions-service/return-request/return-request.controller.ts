import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReturnRequestService } from './return-request.service';
import { CreateReturnRequestDto } from './dto/create-return-request.dto';
import { UpdateReturnRequestDto } from './dto/update-return-request.dto';

@Controller('return-request')
export class ReturnRequestController {
  constructor(private readonly returnRequestService: ReturnRequestService) {}

  @Post()
  create(@Body() createReturnRequestDto: CreateReturnRequestDto) {
    return this.returnRequestService.create(createReturnRequestDto);
  }

  @Get()
  findAll() {
    return this.returnRequestService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.returnRequestService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReturnRequestDto: UpdateReturnRequestDto) {
    return this.returnRequestService.update(+id, updateReturnRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.returnRequestService.remove(+id);
  }
}
