import { ConsoleLogger, Injectable, LoggerService, LogLevel } from "@nestjs/common";
import { LogModel } from "./logger.model";

@Injectable()
export class CustomLoggerService extends ConsoleLogger implements LoggerService {
    protected context?: string
    private readonly logLevels: LogLevel[]

    constructor(private readonly logModel: LogModel) {
        super()
        this.logLevels = ['error', 'warn', 'debug', 'verbose']
    }

    setContext(context: string) {
        this.context = context
        super.setContext(context)
    }

    log(message: any, ...optionalParams: any[]) {
        super.log(message, ...optionalParams)
        this.logToDatabase('log', message, ...optionalParams)
    }

    error(message: any, ...optionalParams: any[]) {
        super.error(message, ...optionalParams)
        this.logToDatabase('error', message, ...optionalParams)
    }

    warn(message: any, ...optionalParams: any[]) {
        super.warn(message, ...optionalParams)
        this.logToDatabase('warn', message, ...optionalParams)
    }

    debug(message: any, ...optionalParams: any[]) {
        super.debug(message, ...optionalParams)
        this.logToDatabase('debug', message, ...optionalParams)
    }

    verbose(message: any, ...optionalParams: any[]) {
        super.verbose(message, ...optionalParams)
        this.logToDatabase('verbose', message, ...optionalParams)
    }

    private async logToDatabase(level: LogLevel, message: any, ...optionalParams: any[]) {
        if (!this.logLevels.includes(level)) {
            return
        }

        const logEntry = {
            level,
            message: typeof message === 'object' ? JSON.stringify(message) : message,
            context: this.context,
            timestamp: new Date(),
        }

        if (optionalParams.length > 0 && optionalParams[0] instanceof Error) {
            logEntry['trace'] = optionalParams[0].stack
        }

        try {
            await this.logModel.create(logEntry)
        } catch (error) {
            console.error('Veritabanına log kaydı sırasında hata oluştu:', error)
        }
    }
}