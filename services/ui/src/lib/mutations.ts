import { gql } from "apollo-boost";

export const CREATE_EVENT_MUTATION = gql`
  mutation CreateEvent($input: { mutationType: MutationType! }) {
    createEvent(input: $input) {
      id
      mutationType
      createdAt
      applied
    }
  }
`;
