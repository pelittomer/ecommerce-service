import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod } from 'src/common/types';
import { ApiProperty } from '@nestjs/swagger';

class CardDetailsDto {
    @ApiProperty({ description: 'Credit card number', example: '****-****-****-1234' })
    @IsString()
    card_number: string;

    @ApiProperty({ description: 'Name on the credit card', example: 'John Doe' })
    @IsString()
    card_holder_name: string;

    @ApiProperty({ description: 'Credit card expiry month', example: 12 })
    @IsNumber()
    expiry_month: number;

    @ApiProperty({ description: 'Credit card expiry year', example: 2025 })
    @IsNumber()
    expiry_year: number;
}

class EftDetailsDto {
    @ApiProperty({ description: 'Name of the sender for EFT', example: 'John Doe' })
    @IsString()
    sender_name: string;

    @ApiProperty({ description: 'Bank of the sender for EFT', example: 'Garanti BBVA' })
    @IsString()
    sender_bank: string;

    @ApiProperty({ description: 'Bank of the receiver for EFT', example: 'İş Bankası' })
    @IsString()
    receiver_bank: string;

    @ApiProperty({ description: 'Date of the EFT transfer', example: '2025-05-01T10:00:00.000Z' })
    @Type(() => Date)
    transfer_date: Date;
}

class PaymentDetailsDto {
    @ApiProperty({
        description: 'Card details if payment method is credit card',
        type: CardDetailsDto,
        required: false,
        example: {
            card_number: '****-****-****-1234',
            card_holder_name: 'John Doe',
            expiry_month: 12,
            expiry_year: 2025,
        },
    })
    @IsOptional()
    @ValidateNested()
    @Type(() => CardDetailsDto)
    card_details?: CardDetailsDto;

    @ApiProperty({
        description: 'EFT details if payment method is EFT',
        type: EftDetailsDto,
        required: false,
        example: {
            sender_name: 'John Doe',
            sender_bank: 'Garanti BBVA',
            receiver_bank: 'İş Bankası',
            transfer_date: '2025-05-01T10:00:00.000Z',
        },
    })
    @IsOptional()
    @ValidateNested()
    @Type(() => EftDetailsDto)
    eft_details?: EftDetailsDto;
}

export class CreatePaymentDto {
    @ApiProperty({ description: 'Payment method (e.g., CREDIT_CARD, EFT)', example: PaymentMethod.CreditCard })
    @IsEnum(PaymentMethod)
    @IsNotEmpty()
    payment_method: PaymentMethod;

    @ApiProperty({
        description: 'Details of the payment based on the payment method', type: PaymentDetailsDto, example: {
            card_details: {
                card_number: '****-****-****-1234',
                card_holder_name: 'John Doe',
                expiry_month: 12,
                expiry_year: 2025,
            },
        }
    })
    @ValidateNested()
    @Type(() => PaymentDetailsDto)
    payment_details: PaymentDetailsDto;
}