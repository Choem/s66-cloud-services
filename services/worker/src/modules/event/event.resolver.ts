import { Query, Resolver, Root, Subscription } from '@nestjs/graphql';

import { EventEntity } from '../../database/entities/event.entity';
import { Topic } from '../../lib/topic';
import { EventsStatusChangedPayload } from './payloads/eventsStatusChangedPayload';

@Resolver(EventEntity)
export class EventResolver {
  constructor() {}

  @Query(returns => [String])
  async dummy(): Promise<string[]> {
    return [];
  }

  @Subscription(returns => EventsStatusChangedPayload, {
    name: Topic.EVENTS_STATUS_CHANGED,
  })
  eventsStatusChanged(
    @Root() payload: EventsStatusChangedPayload,
  ): EventsStatusChangedPayload {
    return payload;
  }
}
