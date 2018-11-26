"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Cloud functions
//const path = require('path');
var functions = require('firebase-functions');
var bodyParser = require('body-parser');
var admin = require('firebase-admin');
var Cors = require("cors");
var express = require("express");
var expressGraphQL = require('express-graphql');
//const schema = require('./schema/schema');
var schema_1 = __importDefault(require("./schema/schema"));
var fileUpload = require('./services/fileUpload');
var apollo_server_express_1 = require("apollo-server-express");
var schemaPrinter_1 = require("graphql/utilities/schemaPrinter");
var neo4j_1 = require("./db/neo4j");
// import { SubscriptionServer } from 'subscriptions-transport-ws';
var app = express();
// The GraphQL endpoint
app.use('/graphql', bodyParser.json(), apollo_server_express_1.graphqlExpress({ schema: schema_1.default }));
// GraphiQL, a visual editor for queries
app.use('/graphiql', apollo_server_express_1.graphiqlExpress({ endpointURL: '/graphql/graphql' }));
app.use("/schema", function (req, res) {
    res.set("Content-Type", "text/plain");
    res.send(schemaPrinter_1.printSchema(schema_1.default));
});
exports.graphql = functions.https.onRequest(app);
var uploadImageToStorage = function (file) {
    console.log('uploadImageToStorage ', file);
    var storage = admin.storage();
    return new Promise(function (resolve, reject) {
        var fileUploadLocal = storage.bucket().file(file.originalname);
        var blobStream = fileUploadLocal.createWriteStream({
            metadata: {
                contentType: "image/jpg"
            }
        });
        blobStream.on("error", function (error) { return reject(error); });
        blobStream.on("finish", function () {
            fileUploadLocal.getMetadata()
                .then(function (metadata) { return resolve(metadata); })
                .catch(function (error) { return reject(error); });
        });
        blobStream.end(file.buffer);
    });
};
// Upload file to firebase storage
var api = express().use(Cors({ origin: true }));
fileUpload("/picture", api);
api.post("/picture", function (req, response, next) {
    console.log('pic upload req: ', req);
    uploadImageToStorage(req.files.file[0])
        .then(function (metadata) {
        console.log('upload promise return: ', metadata);
        response.status(200).json(metadata[0]);
        return next();
    })
        .catch(function (error) {
        console.error(error);
        response.status(500).json({ error: error });
        next();
    });
});
api.use("/test", function (req, res) {
    console.log('test');
    res.send("hi!");
});
exports.api = functions.https.onRequest(api);
exports.coords = functions.https.onRequest(function (req, res) {
    console.log('req body: ', req.body);
    var session = neo4j_1.driver.session();
    // Ensure the request is valid
    if (!req.body) {
        console.log('invalid request body: ', req.body);
        res.status(500);
        return res.send('failed to updated coords. Invalided request body: ', req.body);
    }
    else if (!req.body.location) {
        console.log('invalid request body: ', req.body);
        res.status(500);
        return res.send('failed to updated coords. Invalided request body: ', req.body);
    }
    else if (!req.body.location.coords) {
        console.log('invalid request body: ', req.body);
        res.status(500);
        return res.send('failed to updated coords. Invalided request body: ', req.body);
    }
    var id = req.body.id;
    var latitude = req.body.location.coords.latitude;
    var longitude = req.body.location.coords.longitude;
    return session.run("MATCH(n:User {id:'" + id + "'}) SET n.latitude=" + latitude + ", n.longitude=" + longitude)
        .then(function () {
        console.log("coords (" + latitude + "," + longitude + ") successfully updated for id " + id);
        res.status(200);
        return res.send("coords (" + latitude + "," + longitude + ") successfully updated for id " + id);
    })
        .catch(function (e) {
        console.log("error updating coords (" + latitude + "," + longitude + ") for id " + id + ": " + e);
        res.status(500);
        return res.send("coords (" + latitude + "," + longitude + ") successfully updated for id " + id);
    })
        .finally(function () { return session.close(); });
});
exports.coords = functions.https.onRequest(function (req, res) {
    console.log('req body: ', req.body);
    var session = neo4j_1.driver.session();
    // Ensure the request is valid
    if (!req.body) {
        console.log('invalid request body: ', req.body);
        res.status(500);
        return res.send('failed to updated coords. Invalided request body: ', req.body);
    }
    else if (!req.body.location) {
        console.log('invalid request body: ', req.body);
        res.status(500);
        return res.send('failed to updated coords. Invalided request body: ', req.body);
    }
    else if (!req.body.location.coords) {
        console.log('invalid request body: ', req.body);
        res.status(500);
        return res.send('failed to updated coords. Invalided request body: ', req.body);
    }
    var id = req.body.id;
    var latitude = req.body.location.coords.latitude;
    var longitude = req.body.location.coords.longitude;
    return session.run("MATCH(n:User {id:'" + id + "'}) SET n.latitude=" + latitude + ", n.longitude=" + longitude)
        .then(function () {
        console.log("coords (" + latitude + "," + longitude + ") successfully updated for id " + id);
        res.status(200);
        return res.send("coords (" + latitude + "," + longitude + ") successfully updated for id " + id);
    })
        .catch(function (e) {
        console.log("error updating coords (" + latitude + "," + longitude + ") for id " + id + ": " + e);
        res.status(500);
        return res.send("coords (" + latitude + "," + longitude + ") successfully updated for id " + id);
    })
        .finally(function () { return session.close(); });
});
