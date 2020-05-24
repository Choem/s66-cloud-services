import { Query, Resolver, Subscription } from '@nestjs/graphql';

import { EventEntity } from '../../database/entities/event.entity';
import { Topic } from '../../lib/topic';
import { EventsStatusChangedPayload } from './payloads/eventsStatusChangedPayload';
import { PUB_SUB } from '../../lib/constants';
import { Inject } from '@nestjs/common';
import { PubSubEngine } from 'graphql-subscriptions';

@Resolver(EventEntity)
export class EventResolver {
  constructor(
    @Inject(PUB_SUB)
    private readonly pubSub: PubSubEngine,
  ) {}

  @Query(returns => [String])
  async dummy(): Promise<string[]> {
    return [];
  }

  @Subscription(returns => EventsStatusChangedPayload, {
    name: Topic.EVENTS_STATUS_CHANGED,
    resolve: (payload: EventsStatusChangedPayload) => payload,
  })
  eventsStatusChanged() {
    return this.pubSub.asyncIterator(Topic.EVENTS_STATUS_CHANGED);
  }
}
