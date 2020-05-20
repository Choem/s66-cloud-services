import {Args, Mutation, Query, Resolver, Root, Subscription} from '@nestjs/graphql';
import {EventStatusType} from 'src/database/enums/eventStatusType';

import {EventEntity} from '../../database/entities/event.entity';
import {Topic} from '../../lib/topic';

import {EventService} from './event.service';
import {CreateEventInput} from './inputs/createEventInput';
import {EventStatusChangedPayload} from './payloads/eventStatusChangedPayload';

@Resolver(EventEntity)
export class EventResolver {
  constructor(private readonly eventService: EventService) {}

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

  @Subscription(returns => EventEntity, {name: Topic.EVENT_STATUS_CHANGED})
  eventStatusChanged(@Root() payload: EventStatusChangedPayload):
      EventStatusChangedPayload {
    return payload;
  }
}
