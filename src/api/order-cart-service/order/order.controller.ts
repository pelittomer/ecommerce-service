import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/types';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer)
  @Post()
  createOrder() {
    /*
    This function creates a new order based on the user's current cart and shipping information.
    */
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer)
  @Get()
  fetchOrder() {
    /*
    This function retrieves and lists all the orders placed by the authenticated user.
    */
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer)
  @Get(':id')
  fetchOrderDetails(
    @Param('id', ParseObjectIdPipe) orderId: Types.ObjectId
  ) {
    /*
    This function retrieves and displays the detailed information for a specific order, identified by the provided order ID.
    */
  }

}
