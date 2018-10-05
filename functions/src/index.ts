// Cloud functions
//const path = require('path');
const functions = require('firebase-functions');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const Cors = require("cors");
const express = require("express");
const expressGraphQL = require('express-graphql');
//const schema = require('./schema/schema');
import schema from './schema/schema';
const fileUpload = require('./services/fileUpload');
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { printSchema } from 'graphql/utilities/schemaPrinter';

import { createServer } from 'http';
import { execute } from 'graphql';
import { driver } from  './db/neo4j';
// import { SubscriptionServer } from 'subscriptions-transport-ws';

const app = express();

// The GraphQL endpoint
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));

// GraphiQL, a visual editor for queries
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql/graphql' }));

app.use("/schema", (req, res) => {
  res.set("Content-Type", "text/plain")
  res.send(printSchema(schema))
})

exports.graphql = functions.https.onRequest(app);

const uploadImageToStorage = file => {
  console.log('uploadImageToStorage ', file)
  const storage = admin.storage();
  return new Promise((resolve, reject) => {
      const fileUploadLocal = storage.bucket().file(file.originalname);
      const blobStream = fileUploadLocal.createWriteStream({
          metadata: {
              contentType: "image/jpg"
          }
      });

      blobStream.on("error", error => reject(error));

      blobStream.on("finish", () => {
          fileUploadLocal.getMetadata()
          .then(metadata => resolve(metadata))
          .catch(error => reject(error));
      });

  blobStream.end(file.buffer);
});
}

// Upload file to firebase storage
const api = express().use(Cors({ origin: true }));

fileUpload("/picture", api);

api.post("/picture", (req, response, next) => {
  console.log('pic upload req: ',req)
  uploadImageToStorage(req.files.file[0])
  .then(metadata => {
    console.log('upload promise return: ', metadata);
    response.status(200).json(metadata[0]);
    return next();
  })
  .catch(error => {
    console.error(error);
    response.status(500).json({ error });
    next();
  });
});

api.use("/test", (req, res) => {
  console.log('test');
  res.send("hi!");
});


exports.api = functions.https.onRequest(api);

exports.coords = functions.https.onRequest((req, res) => {
  console.log('req body: ',req.body);

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
});

exports.coords = functions.https.onRequest((req, res) => {
  console.log('req body: ',req.body);

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
});
