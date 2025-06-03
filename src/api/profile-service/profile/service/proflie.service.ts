import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { SharedUtilsService } from 'src/common/utils/shared-utils.service';
import { ProfileRepository } from '../repository/profile.repository';
import { ProfileDocument } from '../entities/types';
import { IProfileService, UpdateProfileServiceParams } from './profile.service.interface';
import { PROFILE_MESSAGE } from '../constants/profile.message';

@Injectable()
export class ProfileService implements IProfileService {
    constructor(
        private readonly profileRepository: ProfileRepository,
        private readonly sharedUtilsService: SharedUtilsService,
    ) { }

    async updateProfile(params: UpdateProfileServiceParams): Promise<string> {
        const { payload, req, uploadedImage } = params
        const user = this.sharedUtilsService.getUserIdFromRequest(req)
        await this.profileRepository.findOneAndUpdate({ user, payload, uploadedImage })
        return PROFILE_MESSAGE.PROFILE_UPDATE_SUCCESS
    }

    async findProfile(req: Request): Promise<ProfileDocument | null> {
        const user = this.sharedUtilsService.getUserIdFromRequest(req)
        return this.profileRepository.findOne({ user })
    }
}
