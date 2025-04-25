import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserDocument } from './schemas/user.schema';
import { Request } from 'express';
import { SharedUtilsService } from 'src/common/utils/shared-utils.service';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly sharedUtilsService: SharedUtilsService,
    ) { }

    findUser(req: Request): Promise<UserDocument | null> {
        const user = this.sharedUtilsService.getUserInfo(req)
        return this.userRepository.findById(user.userId)
    }
}
