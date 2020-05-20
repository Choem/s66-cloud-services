import {EventStatusType} from '../models/eventStatusType';

export interface EventStatusChangedPayload {
  id: number;
  eventStatusType: EventStatusType
}

export interface StatisticUpdatedPayload {
  id: number;
  total: number;
}