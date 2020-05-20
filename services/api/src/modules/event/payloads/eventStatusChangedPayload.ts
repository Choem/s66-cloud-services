import {EventStatusType} from '../../../database/enums/eventStatusType';

export interface EventStatusChangedPayload {
  id: number;
  eventStatusType: EventStatusType
}