import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { Logger, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppConfig } from './config/type';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ConfigService } from '@nestjs/config';
import { LogModel } from './common/logging/logger.model';
import { CustomLoggerService } from './common/logging/logger.service';


function setupSwagger(app) {
  const config = new DocumentBuilder()
    .setTitle('E-commerce API')
    .setDescription('API documentation for managing products, orders, and users in an e-commerce platform.')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //logger setup
  const logModel = app.get(LogModel)
  const customLogger = new CustomLoggerService(logModel)
  app.useLogger(customLogger)
  const logger = new Logger('App')
  // Sets the global prefix for all API routes to '/api'
  app.setGlobalPrefix('api')
  //middleware
  app.use(cookieParser())
  app.use(helmet())
  app.enableCors()
  //swagger configuration
  setupSwagger(app)

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      validationError: {
        target: true,
        value: true,
      },
    })
  )

  app.useGlobalFilters(new HttpExceptionFilter())

  const port = app.get(ConfigService<AppConfig, true>).get('api.port', { infer: true })
  await app.listen(port)

  logger.log(`Application started on port:${port}`)
}
bootstrap();
