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
  subscriptionsEndpoint: process.env.GRAPHQL_WS_URL, 
}));

app.use("/schema", (req, res) => {
  res.set("Content-Type", "text/plain")
  res.send(printSchema(schema))
});

app.use("/coords", bodyParser.json(), (req, res) => {
  const session = driver.session();

  // Ensure the request is valid
  if(!req.body) {
    console.log('invalid request body: ',req.body);
    res.status(500);
    return res.send('failed to updated coords. Invalided request body: ',req.body);
  } else if(!req.body.location) {
    console.log('invalid request body: ',req.body);
    res.status(500);
    return res.send('failed to updated coords. Invalided request body: ',req.body);
  } else if (!req.body.location.coords) {
    console.log('invalid request body: ',req.body);
    res.status(500);
    return res.send('failed to updated coords. Invalided request body: ',req.body);
  }

  const id = req.body.id
  const latitude = req.body.location.coords.latitude;
  const longitude = req.body.location.coords.longitude;

  return session.run(`MATCH(n:User {id:'${id}'}) SET n.latitude=${latitude}, n.longitude=${longitude}`)
    .then(() => {
      console.log(`coords (${latitude},${longitude}) successfully updated for id ${id}`)
      res.status(200);
      return res.send(`coords (${latitude},${longitude}) successfully updated for id ${id}`)
    })
    .catch((e) => {
      console.log(`error updating coords (${latitude},${longitude}) for id ${id}: ${e}`)
      res.status(500);
      return res.send(`coords (${latitude},${longitude}) successfully updated for id ${id}`)
    })
    .finally(() => session.close())
})

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
