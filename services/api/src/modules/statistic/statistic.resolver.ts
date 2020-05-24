import { Query, Resolver, Root, Subscription } from '@nestjs/graphql';

import {
  STATISTIC_ID,
  StatisticEntity,
} from '../../database/entities/statistic.entity';
import { Topic } from '../../lib/topic';

import { StatisticUpdatedPayload } from './payloads/statisticUpdatedPayload';
import { StatisticService } from './statistic.service';
import { Inject } from '@nestjs/common';
import { PubSubEngine } from 'graphql-subscriptions';
import { PUB_SUB } from '../../lib/constants';

@Resolver(StatisticEntity)
export class StatisticResolver {
  constructor(
    @Inject(PUB_SUB)
    private readonly pubSub: PubSubEngine,
    private readonly statisticService: StatisticService,
  ) {}

  @Query(returns => StatisticEntity)
  findStatisticById() {
    return this.statisticService.findById(STATISTIC_ID);
  }

  @Subscription(returns => StatisticEntity, {
    name: Topic.STATISTIC_UPDATED,
    resolve: (payload: StatisticUpdatedPayload) => payload,
  })
  statisticUpdated() {
    return this.pubSub.asyncIterator(Topic.STATISTIC_UPDATED);
  }
}
