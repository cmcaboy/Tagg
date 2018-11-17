import { ApolloServer } from "apollo-server";

import typeDefs from "./typeDefs";
import resolvers from "./resolvers";

export default new ApolloServer({
  typeDefs,
  resolvers
});
