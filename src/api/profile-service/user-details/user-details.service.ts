import { Injectable } from '@nestjs/common';
import { PartialUpdateUserDetailDto } from './dto/update-user-detail.dto';
import { Request } from 'express';
import { UserDetailsRepository } from './user-details.repository';
import { SharedUtilsService } from 'src/common/utils/shared-utils.service';
import { Types } from 'mongoose';
import { UserDetailsDocument } from './entities/types';

@Injectable()
export class UserDetailsService {
    constructor(
        private readonly userDetailsRepository: UserDetailsRepository,
        private readonly sharedUtilsService: SharedUtilsService,
    ) { }

    async updateUserDetails(userInputs: PartialUpdateUserDetailDto, req: Request, uploadedImage: Express.Multer.File): Promise<string> {
        const user = this.sharedUtilsService.getUserInfo(req)
        const userId = new Types.ObjectId(user.userId)

        await this.userDetailsRepository.findOneAndUpdate({ user: userId }, userInputs, uploadedImage)

        return 'Your profile has been successfully updated.'
    }

    async findUserDetails(req: Request): Promise<UserDetailsDocument | null> {
        const user = this.sharedUtilsService.getUserInfo(req)
        const userId = new Types.ObjectId(user.userId)

        return this.userDetailsRepository.findOne({ user: userId })
    }
}
