import { makeExecutableSchema } from 'graphql-tools';

import {RootQueryType} from './types/root_query_type';
import {mutation} from './mutations';

import typeDefs from './typeDefs';
import resolvers from './resolvers';

export default makeExecutableSchema({
  typeDefs,
  resolvers
});
