import { gql } from "apollo-boost";
import { Topic } from "./topic";

export const EVENTS_STATUS_CHANGED_SUBSCRIPTION = gql`
  subscription EventsStatusChanged {
    ${Topic.EVENTS_STATUS_CHANGED} {
      changedEvents {
        id
        eventStatusType
      }
    }
  }
`;

export const STATISTIC_UPDATED_SUBSCRIPTION = gql`
  subscription StatisticUpdated {
    ${Topic.STATISTIC_UPDATED} {
      id
      total
    }
  }
`;
