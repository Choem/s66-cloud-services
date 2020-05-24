import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from '../../database/entities/event.entity';
import { EventResolver } from './event.resolver';
import { EventService } from './event.service';
import { PUB_SUB } from '../../lib/constants';
import { getPubSub } from '../../lib/getPubSub';

@Module({
  providers: [
    EventResolver,
    EventService,
    { provide: PUB_SUB, useValue: getPubSub() },
  ],
  imports: [TypeOrmModule.forFeature([EventEntity])],
})
export class EventModule {}
