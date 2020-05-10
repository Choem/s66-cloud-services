import { gql } from "apollo-boost";

export const FIND_ALL_EVENTS_QUERY = gql`
  query FindAllEvents {
    findAllEvents {
      id
      mutationType
      createdAt
      applied
    }
  }
`;

export const FIND_STATISTIC_BY_ID_QUERY = gql`
  query FindStatisticById {
    findStatisticById {
      total
    }
  }
`;
