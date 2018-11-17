const bodyParser = require("body-parser");
const express = require("express");
import serverApollo from "./schema/schema";
import { createServer } from "http";
import { driver } from "./db/neo4j";

serverApollo.listen().then(({ url }) => {
  console.log(`Apollo Server ready at ${url}`);
});

const app = express();

app.use("/coords", bodyParser.json(), (req, res) => {
  const session = driver.session();

  // Ensure the request is valid
  if (!req.body) {
    console.log("invalid request body: ", req.body);
    res.status(500);
    return res.send(
      "failed to updated coords. Invalided request body: ",
      req.body
    );
  } else if (!req.body.location) {
    console.log("invalid request body: ", req.body);
    res.status(500);
    return res.send(
      "failed to updated coords. Invalided request body: ",
      req.body
    );
  } else if (!req.body.location.coords) {
    console.log("invalid request body: ", req.body);
    res.status(500);
    return res.send(
      "failed to updated coords. Invalided request body: ",
      req.body
    );
  }

  const id = req.body.id;
  const latitude = req.body.location.coords.latitude;
  const longitude = req.body.location.coords.longitude;

  return session
    .run(
      `MATCH(n:User {id:'${id}'}) SET n.latitude=${latitude}, n.longitude=${longitude}`
    )
    .then(() => {
      console.log(
        `coords (${latitude},${longitude}) successfully updated for id ${id}`
      );
      res.status(200);
      return res.send(
        `coords (${latitude},${longitude}) successfully updated for id ${id}`
      );
    })
    .catch(e => {
      console.log(
        `error updating coords (${latitude},${longitude}) for id ${id}: ${e}`
      );
      res.status(500);
      return res.send(
        `coords (${latitude},${longitude}) successfully updated for id ${id}`
      );
    })
    .finally(() => session.close());
});

const server = createServer(app);

server.listen(4000, ({ url }) => {
  console.log(`API ready at ready at ${url}`);
});
