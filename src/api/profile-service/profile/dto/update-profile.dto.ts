import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDate, IsEnum, IsOptional, IsString } from "class-validator";
import { Gender } from "src/common/types";

class UpdateProfileDto {
    @ApiProperty({ description: "User's first name", example: 'John' })
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value.trim())
    first_name: string;

    @ApiProperty({ description: "User's last name", example: 'Doe' })
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value.trim())
    last_name: string;

    @IsOptional()
    @IsDate()
    @ApiProperty({ description: "User's birth date", example: '1990-01-01T00:00:00.000Z' })
    birth_of_date: Date;

    @IsOptional()
    @IsEnum(Gender)
    @ApiProperty({ enum: Gender, description: "User's gender", example: Gender.Male })
    gender: Gender;
}

export class PartialUpdateProfileDto extends PartialType(UpdateProfileDto) { }

