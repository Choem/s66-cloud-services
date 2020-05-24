import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatisticEntity } from '../../database/entities/statistic.entity';
import { StatisticResolver } from './statistic.resolver';
import { StatisticService } from './statistic.service';
import { PUB_SUB } from '../../lib/constants';
import { getPubSub } from '../../lib/getPubSub';

@Module({
  providers: [
    StatisticResolver,
    StatisticService,
    { provide: PUB_SUB, useValue: getPubSub() },
  ],
  imports: [TypeOrmModule.forFeature([StatisticEntity])],
})
export class StatisticModule {}
