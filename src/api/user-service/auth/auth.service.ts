import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { Role } from 'src/common/types';
import { UserRepository } from '../user/user.repository';
import { genSalt, hash } from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepository
    ) { }

    private readonly logger = new Logger(AuthService.name)

    async register(userInputs: RegisterDto, role: Exclude<Role, Role.Admin>): Promise<string> {
        const { username, email, password } = userInputs

        const userExists = await this.userRepository.findByOrQuery({ username, email })
        if (userExists) {
            if (userExists.username === username) {
                throw new BadRequestException('This username is already in use. Please choose another username.')
            } else if (userExists.email === email) {
                throw new BadRequestException('This email address is already registered. Please use a different email address.')
            }
        }

        //Hash the password
        const salt = await genSalt()
        const hashedPassword = await hash(password, salt)

        const user = await this.userRepository.create({
            ...userInputs,
            password: hashedPassword,
        }, role)

        this.logger.log(`User registration completed successfully: username=${username}, userId=${user._id}, role=${role}`)

        return 'Your registration is complete. You can now log in.'
    }

}
