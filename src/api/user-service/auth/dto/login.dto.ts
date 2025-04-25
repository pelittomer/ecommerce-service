import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, Length } from "class-validator";

export class LoginDto {
    @ApiProperty({ example: 'john.doe@example.com', description: 'Email address of the user' })
    @IsEmail()
    @IsNotEmpty()
    @Transform(({ value }) => value.trim())
    email: string;

    @ApiProperty({ example: 'password123', description: 'Password of the user (between 5 and 16 characters)' })
    @Length(5, 16)
    @IsNotEmpty()
    @Transform(({ value }) => value.trim())
    password: string;
}
