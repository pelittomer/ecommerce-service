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
    @Param('id', ParseObjectIdPipe) cartId: Types.ObjectId
  ) {
    /*
    This function removes a specific product from the user's shopping cart, identified by the provided ID.
    */
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer)
  @Get()
  fetchCart() {
    /*
    This function retrieves and lists all the products currently in the user's shopping cart.
    */
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer)
  @Delete()
  clearCart() {
    /*
    This function removes all the products from the user's shopping cart, effectively emptying it.
    */
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer)
  @Put(':id')
  updateCart(
    @Param('id', ParseObjectIdPipe) cartId: Types.ObjectId
  ) {
    /*
    This function modifies the quantity of a specific product in the user's shopping cart.
    */
  }


}
