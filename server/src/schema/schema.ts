import typeDefs from './typeDefs';
import { resolvers } from './resolvers/index';
import neoAPI from './datasources/neo';
import firestoreAPI from './datasources/firestore';
import { driver } from '../db/neo4j';
import { db } from '../db/firestore';

// import statement did not work here
const { ApolloServer } = require('apollo-server-express');

const playground: any = {
  settings: {
    'editor.cursorShape': 'line',
  },
};

// Create a neo4j conneciton once rather than for every request
const session = driver.session();

// set up the data sources our resolvers need
const dataSources = () => ({
  neoAPI: new neoAPI({ session }),
  firestoreAPI: new firestoreAPI({ db }),
});

export default new ApolloServer({
  typeDefs,
  resolvers,
  playground,
  dataSources,
  engine: {
    apiKey: 'service:cmcaboy-2497:fJtoyV5uQQfIQ0I11WiXqg',
  },
});
