"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const express = require("express");
const { createServer } = require("http");
const schema_1 = require("./schema/schema");
const neo4j_1 = require("./db/neo4j");
schema_1.default.listen().then(({ url }) => {
    console.log(`Apollo Server ready at ${url}`);
});
const app = express();
app.use("/coords", bodyParser.json(), (req, res) => {
    const session = neo4j_1.driver.session();
    // Ensure the request is valid
    if (!req.body) {
        console.log("invalid request body: ", req.body);
        res.status(500);
        return res.send("failed to updated coords. Invalided request body: ", req.body);
    }
    else if (!req.body.location) {
        console.log("invalid request body: ", req.body);
        res.status(500);
        return res.send("failed to updated coords. Invalided request body: ", req.body);
    }
    else if (!req.body.location.coords) {
        console.log("invalid request body: ", req.body);
        res.status(500);
        return res.send("failed to updated coords. Invalided request body: ", req.body);
    }
    const id = req.body.id;
    const latitude = req.body.location.coords.latitude;
    const longitude = req.body.location.coords.longitude;
    return session
        .run(`MATCH(n:User {id:'${id}'}) SET n.latitude=${latitude}, n.longitude=${longitude}`)
        .then(() => {
        console.log(`coords (${latitude},${longitude}) successfully updated for id ${id}`);
        res.status(200);
        return res.send(`coords (${latitude},${longitude}) successfully updated for id ${id}`);
    })
        .catch(e => {
        console.log(`error updating coords (${latitude},${longitude}) for id ${id}: ${e}`);
        res.status(500);
        return res.send(`coords (${latitude},${longitude}) successfully updated for id ${id}`);
    })
        .finally(() => session.close());
});
const server = createServer(app);
server.listen(4000, ({ url }) => {
    console.log(`API ready at ready at ${url}`);
});
//# sourceMappingURL=index.js.map