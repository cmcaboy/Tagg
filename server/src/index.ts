const bodyParser = require("body-parser");
const express = require("express");
import server from "./schema/schema";
import { driver } from "./db/neo4j";
import { Application, Request, Response } from "express";

// server.listen().then(({ url }) => {
//   console.log(`Apollo Server ready at ${url}`);
// });

const app: Application = express();
const path: string = "/graphql";

app.use("/coords", bodyParser.json(), (req: Request, res: Response) => {
  const session = driver.session();

  // Ensure the request is valid
  if (!req.body) {
    console.log("invalid request body: ", req.body);
    res.status(500);
    return res.send(
      `failed to update coords. Invalided request body: ${req.body}`
    );
  } else if (!req.body.location) {
    console.log("invalid request body: ", req.body);
    res.status(500);
    return res.send(
      `failed to updated coords. Invalided request body: ${req.body}`
    );
  } else if (!req.body.location.coords) {
    console.log("invalid request body: ", req.body);
    res.status(500);
    return res.send(
      `failed to updated coords. Invalided request body: ${req.body}`
    );
  }

  const id: string = req.body.id;
  const latitude: number = req.body.location.coords.latitude;
  const longitude: number = req.body.location.coords.longitude;

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
    .catch((e: string) => {
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

//  const server = createServer(app);

server.applyMiddleware({
  app,
  path
});

app.listen(4000, () => {
  console.log(`API ready at ready at port 4000`);
});
