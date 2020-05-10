import { Resolver, Query, Mutation } from '@nestjs/graphql';
import { EventEntity } from '../../database/entities/event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventInput } from './inputs/createEventInput';

@Resolver(EventEntity)
export class EventResolver {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
  ) {}

  @Mutation(returns => EventEntity)
  async createEvent(createEventInput: CreateEventInput): Promise<EventEntity> {
    return this.eventRepository.save(createEventInput);
  }

  @Query(returns => [EventEntity])
  async findAllEvents(): Promise<EventEntity[]> {
    return await this.eventRepository.find({ order: { createdAt: 'DESC' } });
  }
}
