import { Module } from '@nestjs/common';
import { StatisticResolver } from './statistic.resolver';
import { getPubSub } from '../../lib/getPubSub';
import { PUB_SUB } from '../../lib/constants';

@Module({
  providers: [StatisticResolver, { provide: PUB_SUB, useValue: getPubSub() }],
  imports: [],
})
export class StatisticModule {}
