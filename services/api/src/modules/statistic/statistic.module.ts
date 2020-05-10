import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatisticEntity } from '../../database/entities/statistic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StatisticEntity])],
})
export class StatisticModule {}
