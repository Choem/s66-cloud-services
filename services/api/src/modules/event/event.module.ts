import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from '../../database/entities/event.entity';
import { EventResolver } from './event.resolver';
import { EventService } from './event.service';

@Module({
  providers: [EventResolver, EventService],
  imports: [TypeOrmModule.forFeature([EventEntity])],
})
export class EventModule {}
