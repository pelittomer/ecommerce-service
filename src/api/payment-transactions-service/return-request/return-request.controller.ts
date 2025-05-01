import { Body, Controller, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ReturnRequestService } from './return-request.service';
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
    @Body() userInputs: CreateReturnRequestDto,
    @Req() req: Request
  ) {
    return this.returnRequestService.createReturnRequest(userInputs, req)
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Seller)
  @Put()
  updateReturnRequest() {
    /*
    This function updates the status or details of an existing return request (for example, approving or rejecting the return).
    */
  }
}
