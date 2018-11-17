const { ApolloServer } = require("apollo-server");

import typeDefs from "./typeDefs";
import resolvers from "./resolvers";

export default new ApolloServer({
  typeDefs,
  resolvers
});
