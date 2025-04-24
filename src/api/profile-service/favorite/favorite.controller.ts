import { Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/types';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Controller('favorite')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) { }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer)
  @Post()
  createFavorite() {
    /*
      This function adds a product or item to the user's list of favorites.
     */
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer)
  @Delete(':id')
  removeFavorite(
    @Param('id', ParseObjectIdPipe) favoriteId: Types.ObjectId
  ) {
    /*
    This function removes a specific favorite item from the user's favorites list, identified by the provided ID.
    */
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer)
  @Get()
  fetchFavorite() {
    /*
    This function retrieves and lists all the items that the user has marked as favorites.
    */
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer)
  @Delete()
  clearFavorite() {
    /*
    This function removes all the items currently in the user's favorites list, effectively clearing their saved favorites.
    */
  }

}
