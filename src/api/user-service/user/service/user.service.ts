import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { Request } from 'express';
import { SharedUtilsService } from 'src/common/utils/shared-utils.service';
import { UserDocument } from '../entities/types';
import { IUserService } from './user.service.interface';

@Injectable()
export class UserService implements IUserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly sharedUtilsService: SharedUtilsService,
    ) { }

    findUser(req: Request): Promise<UserDocument | null> {
        const user = this.sharedUtilsService.getUserInfo(req)
        const userId = user.userId
        return this.userRepository.findById({ userId })
    }
}
