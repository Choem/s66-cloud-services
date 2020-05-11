import { split } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { API_URL } from "./constants";
import { getMainDefinition } from "apollo-utilities";
import { ApolloClient } from "apollo-boost";
import { InMemoryCache } from "apollo-cache-inmemory";

const httpLink = new HttpLink({
  uri: `${API_URL}:3000/graphql`,
});

const websocketLink = new WebSocketLink({
  uri: `${API_URL}:5000/`,
  options: {
    reconnect: true,
  },
});

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  websocketLink,
  httpLink
);

export const apolloclient = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});
