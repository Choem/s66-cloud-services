import { split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { ApolloClient } from 'apollo-boost';
import { InMemoryCache } from 'apollo-cache-inmemory';
import fetch from 'node-fetch';
import { OperationDefinitionNode } from 'graphql';
import ws from 'ws';

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(
      query,
    ) as OperationDefinitionNode;
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  new WebSocketLink({
    uri: `http://${process.env.WORKER_SERVICE}/graphql/subscriptions`,
    options: {
      reconnect: true,
    },
    webSocketImpl: ws,
  }),
  new HttpLink({
    uri: `http://${process.env.WORKER_SERVICE}/graphql`,
    fetch: fetch as any,
  }),
);

export const workerClient = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});
