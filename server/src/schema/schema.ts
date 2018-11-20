const { ApolloServer } = require("apollo-server-express");
const { importSchema } = require("graphql-import");
const typeDefs = importSchema("typeDefs.graphql");

//import typeDefs from "./typeDefs";
import { resolvers } from "./resolvers";

export default new ApolloServer({
  typeDefs,
  resolvers
});
