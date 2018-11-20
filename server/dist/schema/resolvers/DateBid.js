"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generated_1 = require("../../types/generated");
const neo4j_1 = require("../../db/neo4j");
const session = neo4j_1.driver.session();
exports.DateBid = Object.assign({}, generated_1.DateBidResolvers.defaultResolvers, { dateUser: (parentValue, _) => {
        return session
            .run(`MATCH(a:User)-[:CREATE]->(d:Date)<-[r:BID{id:'${parentValue.id}'}]-(b:User)
                  RETURN a`)
            .then((result) => result.records[0])
            .then((record) => record._fields[0].properties)
            .catch((e) => console.log("winner error: ", e));
    }, bidUser: (parentValue, _) => {
        return session
            .run(`MATCH(a:User)-[:CREATE]->(d:Date)<-[r:BID{id:'${parentValue.id}'}]-(b:User)
                  RETURN b`)
            .then((result) => result.records[0])
            .then((record) => record._fields[0].properties)
            .catch((e) => console.log("winner error: ", e));
    }, date: (parentValue, _) => {
        return session
            .run(`MATCH(a:User)-[:CREATE]->(d:Date)<-[r:BID{id:'${parentValue.id}'}]-(b:User)
                  RETURN d`)
            .then((result) => result.records[0])
            .then((record) => record._fields[0].properties)
            .catch((e) => console.log("winner error: ", e));
    } });
//# sourceMappingURL=DateBid.js.map