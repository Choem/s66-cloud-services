import { MutationType } from "./mutationType";
import { EventStatusType } from "./eventStatusType";

export interface Event {
  id: number;
  mutationType: MutationType;
  createdAt: Date;
  status: EventStatusType;
}
