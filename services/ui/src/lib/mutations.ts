import { gql } from "apollo-boost";

export const CREATE_EVENT_MUTATION = gql`
  mutation CreateEvent($mutationType: MutationType!) {
    createEvent(input: { mutationType: $mutationType }) {
      id
      mutationType
      createdAt
      applied
    }
  }
`;
