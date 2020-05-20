import {EventStatusType} from './eventStatusType';
import {MutationType} from './mutationType';

export interface Event {
  id: number;
  mutationType: MutationType;
  createdAt: Date;
  eventStatusType: EventStatusType;
}
