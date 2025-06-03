import { Injectable, UnauthorizedException } from "@nestjs/common";
import { compare, genSalt, hash } from "bcryptjs";
import { IBcryptService } from "./bcrypt.service.interface";

@Injectable()
export class BcryptService implements IBcryptService {
    async hashPassword(password: string): Promise<string> {
        const salt = await genSalt()
        return hash(password, salt)
    }

    async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
        const match = await compare(password, hashedPassword)
        if (!match) {
            throw new UnauthorizedException('The password you entered is incorrect. Please check your password and try again.')
        }
        return true
    }
}