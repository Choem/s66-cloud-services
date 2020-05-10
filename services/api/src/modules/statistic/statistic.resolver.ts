import { Resolver, Query } from '@nestjs/graphql';
import {
  StatisticEntity,
  STATISTIC_ID,
} from '../../database/entities/statistic.entity';
import { StatisticService } from './statistic.service';

@Resolver(StatisticEntity)
export class StatisticResolver {
  constructor(private readonly statisticService: StatisticService) {}

  @Query(returns => StatisticEntity)
  getStatistic() {
    return this.statisticService.findById(STATISTIC_ID);
  }
}
