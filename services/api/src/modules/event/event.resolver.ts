import { Resolver, Query, Mutation } from '@nestjs/graphql';
import { EventEntity } from '../../database/entities/event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dtos/createEventDto';

@Resolver(EventEntity)
export class EventResolver {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
  ) {}

  @Mutation(returns => EventEntity)
  async createEvent(createEventDto: CreateEventDto): Promise<EventEntity> {
    return this.eventRepository.save(createEventDto);
  }

  @Query(returns => [EventEntity])
  async findAllEvents(): Promise<EventEntity[]> {
    return await this.eventRepository.find({ order: { createdAt: 'DESC' } });
  }
}
