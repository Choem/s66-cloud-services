import { EventStatusType } from "../models/eventStatusType";

export function getEventColor(eventStatusType: EventStatusType): string {
  switch (eventStatusType) {
    case EventStatusType.IDLE:
      return "grey";
    case EventStatusType.WORKING:
      return "yellow";
    case EventStatusType.PROCESSED:
      return "green";
    case EventStatusType.FAILED:
      return "red";
    default:
      throw new Error("Event status type not supported.");
  }
}
