import { Controller, Post, Put, UseGuards } from '@nestjs/common';
import { ReturnRequestService } from './return-request.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/types';

@Controller('return-request')
export class ReturnRequestController {
  constructor(private readonly returnRequestService: ReturnRequestService) { }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer)
  @Post()
  createReturnRequest() {
    /*
    This function initiates a new product return process.
    */
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
