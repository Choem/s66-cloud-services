import { EventStatusType } from "../models/eventStatusType";
import { Topic } from "./topic";

export interface EventStatusChangedPayload {
  [Topic.EVENTS_STATUS_CHANGED]: {
    changedEvents: {
      id: number;
      eventStatusType: EventStatusType;
    }[];
  };
}

export interface StatisticUpdatedPayload {
  [Topic.STATISTIC_UPDATED]: {
    id: number;
    total: number;
  };
}
