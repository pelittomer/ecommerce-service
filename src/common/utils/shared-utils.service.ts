import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { InjectConnection } from "@nestjs/mongoose";
import { ClientSession, Connection } from "mongoose";
import { UserInfo } from "../types";
import { Request } from "express";


@Injectable()
export class SharedUtilsService {
    constructor(@InjectConnection() private readonly connection: Connection) { }
    private readonly logger = new Logger(SharedUtilsService.name)

    async executeTransaction(callback: (session: ClientSession) => Promise<void>): Promise<void> {
        const session: ClientSession = await this.connection.startSession()
        session.startTransaction()
        try {
            await callback(session)
            await session.commitTransaction()
        } catch (error) {
            this.logger.log(error)
            await session.abortTransaction()
            throw new Error('Something went wrong. Please try again.')
        } finally {
            session.endSession()
        }
    }

    getUserInfo(req: Request): UserInfo {
        const user = req['UserInfo']
        if (!user) {
            throw new UnauthorizedException('You must be logged in.')
        }
        return user
    }
}