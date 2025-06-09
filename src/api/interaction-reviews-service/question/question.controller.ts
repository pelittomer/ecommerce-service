import { Body, Controller, Get, Param, Post, Put, Query, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { QuestionService } from './service/question.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/types';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { CreateQuestionDto } from './dto/create-question.dto';
import { Request } from 'express';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { GetQuestionDto } from './dto/get-question.dto';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) { }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer)
  @Post()
  createQuestion(
    @Body() payload: CreateQuestionDto,
    @Req() req: Request
  ) {
    return this.questionService.createQuestion({ payload, req })
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Seller)
  @Put(':id')
  createAnswer(
    @Param('id', ParseObjectIdPipe) questionId: Types.ObjectId,
    @Body() payload: UpdateQuestionDto,
    @Req() req: Request
  ) {
    return this.questionService.createAnswer({ questionId, payload, req })
  }

  @Get()
  fetchQuestion(@Query(ValidationPipe) query: GetQuestionDto) {
    return this.questionService.findQuestions(query)
  }
}
