import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { setUpApp } from './setup-app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.use(cookieSession({ keys: ['cookie'] }));
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true, // will not show extra property
  //   }),
  // );
  //setUpApp(app);
  await app.listen(3000);
}
bootstrap();
