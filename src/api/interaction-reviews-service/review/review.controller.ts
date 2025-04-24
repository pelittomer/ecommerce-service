import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/types';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) { }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer)
  @Post()
  createReview() {
    /*
    This function allows a user to create and submit a new review for a product.
    */
  }

  @Get()
  fetchReview() {
    /*
    This function retrieves and lists all the reviews associated with a specific product, identified by its product_id.
    */
  }
}
