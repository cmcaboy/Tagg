"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require('firebase-functions');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const Cors = require("cors");
const express = require("express");
const schema_1 = require("./schema/schema");
//import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
const { graphiqlExpress, graphqlExpress } = require('apollo-server-express');
const schemaPrinter_1 = require("graphql/utilities/schemaPrinter");
const http_1 = require("http");
const graphql_1 = require("graphql");
const subscriptions_transport_ws_1 = require("subscriptions-transport-ws");
const app = express();
// The GraphQL endpoint
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema: schema_1.default }));
// GraphiQL, a visual editor for queries
app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql/graphql',
    subscriptionsEndpoint: 'ws://35.199.37.151:4000/subscriptions',
}));
app.use("/schema", (req, res) => {
    res.set("Content-Type", "text/plain");
    res.send(schemaPrinter_1.printSchema(schema_1.default));
});
const server = http_1.createServer(app);
server.listen(4000, () => {
    new subscriptions_transport_ws_1.SubscriptionServer({
        execute: graphql_1.execute,
        subscribe: graphql_1.subscribe,
        schema: schema_1.default,
    }, {
        server,
        path: '/subscriptions',
    });
});
//app.listen(4000, () => console.log('GraphQL server running on port 4000.'))
//# sourceMappingURL=index.js.map