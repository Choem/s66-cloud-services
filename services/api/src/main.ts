import { NestFactory } from '@nestjs/core';
import { Connection } from 'typeorm';

import {
  STATISTIC_ID,
  StatisticEntity,
} from './database/entities/statistic.entity';
import { RootModule } from './modules/root.module';
import { intializeSubscribers } from './subscribers/initializeSubscribers';
import { PUB_SUB } from './lib/constants';

async function bootstrap() {
  const app = await NestFactory.create(RootModule);
  app.enableCors();

  const connection = await app.resolve(Connection);

  console.info('Running migrations...');
  await connection.runMigrations({ transaction: 'each' });
  console.info('Migrations done');

  const existingStatisticRow = await connection
    .createQueryBuilder(StatisticEntity, 'statistic')
    .where('statistic.id = :id', { id: STATISTIC_ID })
    .getOne();

  if (!existingStatisticRow) {
    await connection.manager.save(StatisticEntity, { total: 0 });
    console.info('Initial statistic row created');
  }

  await app.listen(3333);

  const pubSub = await app.resolve(PUB_SUB);
  intializeSubscribers(pubSub);
}
bootstrap();
