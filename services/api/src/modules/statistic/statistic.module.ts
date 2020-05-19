import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatisticEntity } from '../../database/entities/statistic.entity';
import { StatisticResolver } from './statistic.resolver';
import { StatisticService } from './statistic.service';

@Module({
  providers: [StatisticResolver, StatisticService],
  imports: [TypeOrmModule.forFeature([StatisticEntity])],
})
export class StatisticModule {}
