import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';
import { PrismaExceptionFilter } from './prisma/prisma-exception.filter';




async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new PrismaExceptionFilter());
  app.enableCors(
    {origin:['http://localhost:3000', 'https://www.parroquiatransfiguracion.cl/'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
  }
  );
  setupSwagger(app); 
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
