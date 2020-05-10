import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEntity } from '../../database/entities/event.entity';
import { Repository } from 'typeorm';
import { CreateEventInput } from './inputs/createEventInput';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
  ) {}

  async create(createEventInput: CreateEventInput): Promise<EventEntity> {
    return this.eventRepository.save(createEventInput);
  }

  async findAll(): Promise<EventEntity[]> {
    return await this.eventRepository.find({ order: { createdAt: 'DESC' } });
  }
}
