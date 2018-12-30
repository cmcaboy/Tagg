import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { withClientState } from 'apollo-link-state';
import { setContext } from 'apollo-link-context';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { ApolloLink, split } from 'apollo-link';
import { persistCache } from 'apollo-cache-persist';
import { AsyncStorage } from 'react-native';
import { PersistentStorage, PersistedData } from 'apollo-cache-persist/types';
import { GRAPHQL_SERVER, GRAPHQL_SERVER_WS } from '../variables';
import { resolvers, defaults } from './localState';

// This file is the setup file for Apollo client

console.log('GRAPHQL_SERVER: ', GRAPHQL_SERVER);
console.log('GRAPHQL_SERVER_WS: ', GRAPHQL_SERVER_WS);

// Initiate the cache
const cache = new InMemoryCache({ dataIdFromObject: object => object.id });
// dataIdFromObject is used for cache fragments. It tells apollo how to uniquely
// identify the fragments, allowing me to use readFragment and writeFragment to update
// the cache.

// persistCache allows apollo to store the cache or local state to AsyncStorage
// This works similar to redux-persist.
persistCache({
  cache,
  storage: AsyncStorage as PersistentStorage<PersistedData<NormalizedCacheObject>>,
});

// stateLink is the local graphql engine for state management
const stateLink = withClientState({
  cache,
  defaults,
  resolvers,
  // typeDefs
});

// We put both the state link and http link in httpLink to let the application
// query the application state when applicable
const httpLink = ApolloLink.from([
  stateLink,
  new HttpLink({
    uri: `${GRAPHQL_SERVER}/graphql`,
    // headers: {
    //   authorization: AsyncStorage.getItem('TaggToken'),
    // },
  }),
]);

// Websockets are used for subscriptions.
const wsLink = new WebSocketLink({
  uri: `${GRAPHQL_SERVER_WS}/subscriptions`,
  options: {
    reconnect: true,
  },
});

// The split function operates like a fi statement. If returned true, it hooks up to
// the web sockets link. If false, it uses the http link.
const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  httpLink,
);

const authLink = setContext(async (_, { headers }) => {
  const token = await AsyncStorage.getItem('TaggToken');
  return {
    headers: {
      ...headers,
      authorization: token,
    },
  };
});

// At this point, the link encapsulates logic to determine if the application is trying
// to access a subscription, graphql server, or state management.
export const client = new ApolloClient({
  cache,
  link: authLink.concat(link),
  connectToDevTools: true,
  initializers: {
    isLoggedIn: () => !!AsyncStorage.getItem('TaggToken'),
  },
  // experimental
  // dataIdFromObject: (object) => {
  //   switch (object.__typename) {
  //     case 'Match':
  //       return object.matchId;
  //     default:
  //       return object.id;
  //   }
  // },
});

// enable remote debugging
// window.__APOLLO_CLIENT__ = client;
