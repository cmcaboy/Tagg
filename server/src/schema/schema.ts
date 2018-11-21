const { ApolloServer } = require("apollo-server-express");
// const { importSchema } = require("graphql-import");
// const typeDefs = importSchema("./typeDefs.graphql");

import typeDefs from "./typeDefs";
import { resolvers } from "./resolvers/index";
const neoAPI = require("./datasources/index");
import { driver } from "../db/neo4j";

const playground: any = {
  settings: {
    "editor.cursorShape": "line"
  }
};

const dataSources = () => ({
  neoAPI: new neoAPI({ driver })
});

export default new ApolloServer({
  typeDefs,
  resolvers,
  playground,
  dataSources
});
