import { ObjectType, Field } from '@nestjs/graphql';
import { EventStatusChangedEntry } from './eventStatusChangedEntry';

@ObjectType()
export class EventsStatusChangedPayload {
  @Field(type => [EventStatusChangedEntry])
  changedEvents: EventStatusChangedEntry[];
}
