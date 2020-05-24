import { Module } from '@nestjs/common';
import { EventResolver } from './event.resolver';
import { PUB_SUB } from '../../lib/constants';
import { getPubSub } from '../../lib/getPubSub';

@Module({
  providers: [EventResolver, { provide: PUB_SUB, useValue: getPubSub() }],
  imports: [],
})
export class EventModule {}
