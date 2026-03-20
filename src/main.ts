import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';
import { PrismaExceptionFilter } from './prisma/prisma-exception.filter';




async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new PrismaExceptionFilter());
  setupSwagger(app);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
