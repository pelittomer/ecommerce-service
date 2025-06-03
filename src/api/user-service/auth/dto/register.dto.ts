import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, MinLength } from "class-validator";
import { BaseAuthDto } from "./base.auth.dto";

export class RegisterDto extends BaseAuthDto {
    @ApiProperty({ example: 'john_doe', description: 'Username of the user' })
    @MinLength(5)
    @IsNotEmpty()
    @Transform(({ value }) => value.trim())
    username: string;
}
