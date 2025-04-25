import { Injectable } from "@nestjs/common";
import { InjectConnection } from "@nestjs/mongoose";
import { ClientSession, Connection } from "mongoose";


@Injectable()
export class SharedUtilsService {
    constructor(@InjectConnection() private readonly connection: Connection) { }

    async executeTransaction(callback: (session: ClientSession) => Promise<void>): Promise<void> {
        const session: ClientSession = await this.connection.startSession()
        session.startTransaction()
        try {
            await callback(session)
            await session.commitTransaction()
        } catch (error) {
            await session.abortTransaction()
            throw new Error('Something went wrong. Please try again.')
        } finally {
            session.endSession()
        }
    }
}