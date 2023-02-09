import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import * as compression from 'compression';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { ResponseTransformInterceptor } from './common/interceptors/response-transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = new Logger('NestApplication');

  app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)

  // Compression
  app.use(compression());

  // Enable Helmet
  app.use(helmet());

  // set CORS
  app.enableCors();

  // Starts listening for shutdown hooks
  // const { httpAdapter } = app.get(HttpAdapterHost);
  app.enableShutdownHooks();

  // Enable Auto Validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  // Interceptor
  app.useGlobalInterceptors(new ResponseTransformInterceptor());

  // Global Filters
  app.useGlobalFilters();

  // Config Service
  const configService = app.get(ConfigService);

  // Global prefix
  app.setGlobalPrefix(configService.get('PREFIX_NAME', 'service_name'));

  // Swagger Configuration
  const swaggerConfig = new DocumentBuilder()
    .setTitle(configService.get('APP_NAME'))
    .setDescription(`The ${configService.get('APP_NAME')} API description`)
    .setVersion('1.0')
    .build();

  const swaggerDocumentOptions: SwaggerDocumentOptions = {
    operationIdFactory: (_: string, methodKey: string) => methodKey,
  };

  const document = SwaggerModule.createDocument(
    app,
    swaggerConfig,
    swaggerDocumentOptions,
  );

  const customOptions: SwaggerCustomOptions = {
    customSiteTitle: `${configService.get('APP_NAME')} API Docs`,
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  };

  SwaggerModule.setup(
    `${configService.get('PREFIX_NAME')}/api`,
    app,
    document,
    customOptions,
  );

  await app.listen(parseInt(configService.get('PORT', '3000'), 10));
  logger.verbose(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
