import {
  Query,
  Resolver,
  Root,
  Subscription,
  Mutation,
  Args,
  ObjectType,
  Field,
  Int,
  InputType,
} from '@nestjs/graphql';

import { StatisticEntity } from '../../database/entities/statistic.entity';
import { Topic } from '../../lib/topic';

import { StatisticUpdatedPayload } from './payloads/statisticUpdatedPayload';
import { PubSubEngine } from 'graphql-subscriptions';
import { Inject } from '@nestjs/common';
import { PUB_SUB } from '../../lib/constants';

@Resolver(StatisticEntity)
export class StatisticResolver {
  constructor(
    @Inject(PUB_SUB)
    private readonly pubSub: PubSubEngine,
  ) {}

  @Query(returns => [String])
  async dummy(): Promise<string[]> {
    return [];
  }

  @Subscription(returns => StatisticEntity, {
    name: Topic.STATISTIC_UPDATED,
    resolve: (payload: StatisticUpdatedPayload) => payload,
  })
  statisticUpdated() {
    return this.pubSub.asyncIterator(Topic.STATISTIC_UPDATED);
  }
}
