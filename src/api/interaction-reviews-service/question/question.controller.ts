import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { QuestionService } from './question.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/types';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { CreateQuestionDto } from './dto/create-question.dto';
import { Request } from 'express';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) { }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer)
  @Post()
  createQuestion(
    @Body() userInputs: CreateQuestionDto,
    @Req() req: Request
  ) {
    return this.questionService.createQuestion(userInputs,req)
  } 

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Seller)
  @Put(':id')
  createAnswer(
    @Param('id', ParseObjectIdPipe) questionId: Types.ObjectId
  ) {
    /*
    This function allows an administrator or seller to create and submit an answer to a specific product question.
    */
  }

  @Get()
  fetchQuestion() {
    /*
    This function retrieves and lists all the questions and their corresponding answers associated with a specific product, identified by its product_id.
    */
  }

}
