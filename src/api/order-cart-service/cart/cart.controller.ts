import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/types';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { CreateCartDto } from './dto/create-cart.dto';
import { Request } from 'express';
import { UpdateCartDto } from './dto/update-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer)
  @Post()
  createCart(
    @Body() userInputs: CreateCartDto,
    @Req() req: Request
  ) {
    return this.cartService.createCart(userInputs, req)
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer)
  @Delete(':id')
  removeCart(
    @Param('id', ParseObjectIdPipe) cartId: Types.ObjectId,
    @Req() req: Request
  ) {
    return this.cartService.removeCart(cartId, req)
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer)
  @Get()
  fetchCart(@Req() req: Request) {
    return this.cartService.findCarts(req)
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer)
  @Delete()
  clearCart(@Req() req: Request) {
    return this.cartService.removeCarts(req)
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer)
  @Put(':id')
  updateCart(
    @Param('id', ParseObjectIdPipe) cartId: Types.ObjectId,
    @Body() userInputs: UpdateCartDto,
    @Req() req: Request
  ) {
    return this.cartService.updateCart(cartId,userInputs,req)
  }


}
