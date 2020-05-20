import { Query, Resolver, Root, Subscription } from '@nestjs/graphql';

import { StatisticEntity } from '../../database/entities/statistic.entity';
import { Topic } from '../../lib/topic';

import { StatisticUpdatedPayload } from './payloads/statisticUpdatedPayload';

@Resolver(StatisticEntity)
export class StatisticResolver {
  constructor() {}

  @Query(returns => [String])
  async dummy(): Promise<string[]> {
    return [];
  }

  @Subscription(returns => StatisticEntity, { name: Topic.STATISTIC_UPDATED })
  statisticUpdated(
    @Root() payload: StatisticUpdatedPayload,
  ): StatisticUpdatedPayload {
    return payload;
  }
}
