import { Body, Controller, Get, Post, Query, Req, UploadedFiles, UseGuards, ValidationPipe } from '@nestjs/common';
import { ReviewService } from './review.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/types';
import { UploadReviewImage } from './decorators/review-upload-image.decorator';
import { CreateReviewDto } from './dto/create-review.dto';
import { Request } from 'express';
import { GetReviewDto } from './dto/get-review.dto';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) { }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer)
  @Post()
  @UploadReviewImage()
  createReview(
    @Body() userInputs: CreateReviewDto,
    @Req() req: Request,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    return this.reviewService.createReview(userInputs, req, files)
  }

  @Get()
  fetchReview(@Query(ValidationPipe) query: GetReviewDto) {
    return this.reviewService.findReviews(query)
  }
}
