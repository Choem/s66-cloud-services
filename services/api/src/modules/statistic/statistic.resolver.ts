import {Query, Resolver, Root, Subscription} from '@nestjs/graphql';

import {STATISTIC_ID, StatisticEntity,} from '../../database/entities/statistic.entity';
import {Topic} from '../../lib/topic';

import {StatisticUpdatedPayload} from './payloads/statisticUpdatedPayload';
import {StatisticService} from './statistic.service';

@Resolver(StatisticEntity)
export class StatisticResolver {
  constructor(private readonly statisticService: StatisticService) {}

  @Query(returns => StatisticEntity)
  findStatisticById() {
    return this.statisticService.findById(STATISTIC_ID);
  }

  @Subscription(returns => StatisticEntity, {name: Topic.STATISTIC_UPDATED})
  statisticUpdated(@Root() payload: StatisticUpdatedPayload):
      StatisticUpdatedPayload {
    return payload;
  }
}
