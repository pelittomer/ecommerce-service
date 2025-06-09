import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { OrderService } from './service/order.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/types';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Request } from 'express';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer)
  @Post()
  createOrder(@Req() req: Request) {
    return this.orderService.createOrder(req)
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer)
  @Get()
  fetchOrder(@Req() req: Request) {
    return this.orderService.findOrders(req)
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer)
  @Get(':id')
  fetchOrderDetails(
    @Param('id', ParseObjectIdPipe) orderId: Types.ObjectId,
    @Req() req: Request
  ) {
    return this.orderService.findOrderDetails({ orderId, req })
  }

}
