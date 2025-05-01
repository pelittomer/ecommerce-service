import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReturnRequestDto {
    @ApiProperty({ description: 'Reason for the return (optional)', example: 'Product did not meet expectations' })
    @IsOptional()
    @IsString()
    reason?: string;

    @ApiProperty({ description: 'Quantity of the item to be returned (optional)', example: 1 })
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    quantity?: number;

    @ApiProperty({ description: 'ID of the order item to be returned', example: '654d7e8f9c0b1a2d3e4f5678' })
    @IsMongoId()
    @IsNotEmpty()
    orderItem: Types.ObjectId;
}