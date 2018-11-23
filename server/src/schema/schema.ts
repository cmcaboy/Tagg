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

// context is information shared with all resolvers.
// Here, I will pull out the header info from the request
// and make sure the user is a valid user. Later, I will
// use the roles parameter to validate the user has permission
// to execute a specific query
const context = async ({ req }: { req: any }) => {
  const auth = (req.headers && req.headers.authorization) || '';
  console.log('auth: ', auth);
  // const email = new Buffer(auth, 'base64').toString('ascii');
  // console.log('email: ', email);

  // I am not doing any type of encryption at the moment;
  const email = auth;

  // I could check for email validity here

  // Retrieve user from db
  let neoRaw;
  try {
    neoRaw = await session.run(
      `MATCH (a:User{id:'${email}'}) RETURN a.id, a.email, a.token, a.roles`,
    );
  } catch (e) {
    // I could throw a real error here
    console.log(`Error retreiving user ${email} from database: ${e}`);
    return null;
  }
  const user = {
    id: neoRaw.records[0]._fields[0],
    email: neoRaw.records[0]._fields[1],
    token: neoRaw.records[0]._fields[2],
    roles: neoRaw.records[0]._fields[3],
  };

  return { user };
};

export default new ApolloServer({
  typeDefs,
  resolvers,
  playground,
  context,
  dataSources,
  engine: {
    apiKey: 'service:cmcaboy-2497:fJtoyV5uQQfIQ0I11WiXqg',
  },
});
