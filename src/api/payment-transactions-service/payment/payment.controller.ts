import { Body, Controller, Param, Put, Req, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/types';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Request } from 'express';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer)
  @Put(':id')
  updatePayment(
    @Body() userInputs: CreatePaymentDto,
    @Param('id', ParseObjectIdPipe) paymentId: Types.ObjectId,
    @Req() req: Request
  ) {
    return this.paymentService.updatePayment(userInputs, paymentId, req)
  }

}
