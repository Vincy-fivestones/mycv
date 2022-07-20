import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
const cookieSession = require('cookie-session');
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieSession({ keys: ['cookie'] }));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // will not show extra property
    }),
  );
  await app.listen(3000);
}
bootstrap();
