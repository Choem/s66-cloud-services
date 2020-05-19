import { gql } from "apollo-boost";

export const EVENT_STATUS_CHANGED_SUBSCRIPTION = gql`
  subscription EventStatusChanged {
    eventStatusChanged {
      id
      status
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
