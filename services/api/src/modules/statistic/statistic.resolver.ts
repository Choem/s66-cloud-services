import { Resolver, Query } from '@nestjs/graphql';
import {
  StatisticEntity,
  STATISTIC_ID,
} from '../../database/entities/statistic.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Resolver(StatisticEntity)
export class StatisticResolver {
  constructor(
    @InjectRepository(StatisticEntity)
    private readonly statisticRepository: Repository<StatisticEntity>,
  ) {}

  @Query(returns => StatisticEntity)
  getStatistic() {
    return this.statisticRepository.findOne({ where: { id: STATISTIC_ID } });
  }
}
