import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ReturnRequestService } from './service/return-request.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/types';
import { CreateReturnRequestDto } from './dto/create-return-request.dto';
import { Request } from 'express';

@Controller('return-request')
export class ReturnRequestController {
  constructor(private readonly returnRequestService: ReturnRequestService) { }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer)
  @Post()
  createReturnRequest(
    @Body() payload: CreateReturnRequestDto,
    @Req() req: Request
  ) {
    return this.returnRequestService.createReturnRequest({ payload, req })
  }
}
