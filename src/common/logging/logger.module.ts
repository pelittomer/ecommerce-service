import { Module } from "@nestjs/common";
import { CustomLoggerService } from "./logger.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Log, LogSchema } from "./schemas/logger.shema";
import { LogModel } from "./logger.model";

@Module({
    providers: [CustomLoggerService, LogModel],
    imports: [MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }])],
    exports: [CustomLoggerService]
})
export class LoggerModule { }