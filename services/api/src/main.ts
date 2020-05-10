import { NestFactory } from '@nestjs/core';
import { RootModule } from './modules/root.module';
import { Connection } from 'typeorm';
import {
  StatisticEntity,
  STATISTIC_ID,
} from './database/entities/statistic.entity';

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
}
bootstrap();
