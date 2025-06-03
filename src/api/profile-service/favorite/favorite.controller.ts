import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { FavoriteService } from './service/favorite.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/types';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { Request } from 'express';

@Controller('favorite')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) { }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer)
  @Post()
  createFavorite(
    @Body() payload: CreateFavoriteDto,
    @Req() req: Request
  ) {
    return this.favoriteService.createFavorite({ payload, req })
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer)
  @Delete(':id')
  removeFavorite(
    @Param('id', ParseObjectIdPipe) favoriteId: Types.ObjectId,
    @Req() req: Request
  ) {
    return this.favoriteService.removeFavorite({ favoriteId, req })
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer)
  @Get()
  fetchFavorite(@Req() req: Request) {
    return this.favoriteService.findFavorites(req)
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer)
  @Delete('all')
  clearFavorite(@Req() req: Request) {
    return this.favoriteService.removeAllFavorites(req)
  }
}
