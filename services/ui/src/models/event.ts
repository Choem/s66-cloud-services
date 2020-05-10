import { MutationType } from "./mutationType";

export interface Event {
  id: number;
  mutationType: MutationType;
  createdAt: Date;
  applied: boolean;
}
