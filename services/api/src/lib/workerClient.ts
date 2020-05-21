import { split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { ApolloClient } from 'apollo-boost';
import { InMemoryCache } from 'apollo-cache-inmemory';

const httpLink = new HttpLink({
  uri: '/worker/graphql',
});

const websocketLink = new WebSocketLink({
  uri: `${window.location.protocol.startsWith('https') ? 'wss' : 'ws'}://${
    window.location.hostname
  }/worker/graphql/subscriptions`,
  options: {
    reconnect: true,
  },
});

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  websocketLink,
  httpLink,
);

export const workerClient = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});
