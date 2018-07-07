const functions = require('firebase-functions');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const Cors = require("cors");
const express = require("express");
import schema from './schema/schema';
//import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
const {graphiqlExpress,graphqlExpress} = require('apollo-server-express');

import { printSchema } from 'graphql/utilities/schemaPrinter';

import { createServer } from 'http';
import { execute, subscribe } from 'graphql';
import { driver } from  './db/neo4j';
import { SubscriptionServer } from 'subscriptions-transport-ws';

const app = express();

// The GraphQL endpoint
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));

// GraphiQL, a visual editor for queries
app.use('/graphiql', graphiqlExpress({ 
  endpointURL: '/graphql/graphql',
  subscriptionsEndpoint: 'ws://35.199.37.151:4000/subscriptions', 
}));

app.use("/schema", (req, res) => {
  res.set("Content-Type", "text/plain")
  res.send(printSchema(schema))
});

const server = createServer(app);

server.listen(4000, () => {
  new SubscriptionServer(
    {
      execute,
      subscribe,
      schema,
    },
    {
      server,
      path: '/subscriptions',
    },
  );
});

//app.listen(4000, () => console.log('GraphQL server running on port 4000.'))
