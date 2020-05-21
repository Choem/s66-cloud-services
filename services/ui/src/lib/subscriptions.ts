import { gql } from "apollo-boost";

export const EVENTS_STATUS_CHANGED_SUBSCRIPTION = gql`
  subscription EventsStatusChanged {
    eventsStatusChanged {
      changedEvents {
        id
        eventStatusType
      }
    }
  }
`;

export const STATISTIC_UPDATED_SUBSCRIPTION = gql`
  subscription StatisticUpdated {
    statisticUpdated {
      id
      total
    }
  }
`;
