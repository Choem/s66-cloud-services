import { ObjectType, Field, Int } from '@nestjs/graphql';

import { EventStatusType } from '../../../database/enums/eventStatusType';

@ObjectType()
export class EventStatusChangedEntry {
  @Field(type => Int)
  id: number;

  @Field(type => EventStatusType)
  eventStatusType: EventStatusType;
}
