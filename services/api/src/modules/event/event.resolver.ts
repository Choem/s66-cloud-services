import {
  Args,
  Mutation,
  Query,
  Resolver,
  Root,
  Subscription,
} from '@nestjs/graphql';

import { EventEntity } from '../../database/entities/event.entity';
import { Topic } from '../../lib/topic';

import { EventService } from './event.service';
import { CreateEventInput } from './inputs/createEventInput';
import { EventsStatusChangedPayload } from './payloads/eventsStatusChangedPayload';
import { PubSubEngine } from 'graphql-subscriptions';
import { Inject } from '@nestjs/common';
import { PUB_SUB } from '../../lib/constants';

@Resolver(EventEntity)
export class EventResolver {
  constructor(
    @Inject(PUB_SUB)
    private readonly pubSub: PubSubEngine,
    private readonly eventService: EventService,
  ) {}

  @Mutation(returns => EventEntity)
  async createEvent(
    @Args('input') createEventInput: CreateEventInput,
  ): Promise<EventEntity> {
    return await this.eventService.create(createEventInput);
  }

  @Query(returns => [EventEntity])
  async findAllEvents(): Promise<EventEntity[]> {
    return await this.eventService.findAll();
  }

  @Subscription(returns => EventsStatusChangedPayload, {
    name: Topic.EVENTS_STATUS_CHANGED,
    resolve: (payload: EventsStatusChangedPayload) => payload,
  })
  eventsStatusChanged() {
    return this.pubSub.asyncIterator(Topic.EVENTS_STATUS_CHANGED);
  }
}
