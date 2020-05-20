import { NestFactory } from '@nestjs/core';
import { RootModule } from './modules/root.module';
import { Connection } from 'typeorm';
import { initializeQueue } from './lib/intializeQueue';
import { PUB_SUB } from './lib/constants';

async function bootstrap() {
  const app = await NestFactory.create(RootModule);
  await app.listen(3333);

  const connection = await app.resolve(Connection);
  const pubSub = await app.resolve(PUB_SUB);
  await initializeQueue(connection, pubSub);
}
bootstrap();
