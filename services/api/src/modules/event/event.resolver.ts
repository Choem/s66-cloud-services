import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { EventEntity } from '../../database/entities/event.entity';
import { CreateEventInput } from './inputs/createEventInput';
import { EventService } from './event.service';

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
}
