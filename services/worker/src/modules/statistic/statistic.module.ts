import { Module } from '@nestjs/common';
import { StatisticResolver } from './statistic.resolver';

@Module({
  providers: [StatisticResolver],
  imports: [],
})
export class StatisticModule {}
