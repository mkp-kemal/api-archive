import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // ✅ Enable class-validator globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // hapus property yang tidak ada di DTO
      forbidNonWhitelisted: true, // kalau ada property asing, langsung error
      transform: true, // auto transform payload ke instance DTO
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Review API')
    .setDescription('API untuk user auth dan review')
    .setVersion('1.0')
    .addBearerAuth() // Untuk JWT bearer auth
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);



  await app.listen(configService.get<number>('PORT') || 3000);
}
bootstrap();

