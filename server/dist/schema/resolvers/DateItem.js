"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generated_1 = require("../../types/generated");
const neo4j_1 = require("../../db/neo4j");
const session = neo4j_1.driver.session();
exports.DateItem = Object.assign({}, generated_1.DateItemResolvers.defaultResolvers, { creator: (parentValue, _) => {
        return session
            .run(`MATCH(a:User)-[:CREATE]->(d:Date{id:'${parentValue.id}'})
                  RETURN a`)
            .then((result) => result.records[0])
            .then((record) => record._fields[0].properties)
            .catch((e) => console.log("creator error: ", e));
    }, num_bids: (parentValue, _) => {
        return session
            .run(`MATCH(d:Date{id:'${parentValue.id}'})
                  WITH size((d)<-[:BID]-(:User)) as num_bids
                  return num_bids`)
            .then((result) => result.records[0])
            .then((record) => record._fields[0])
            .catch((e) => console.log("num_bids error: ", e));
    }, winner: (parentValue, _) => {
        return session
            .run(`MATCH(d:Date{id:'${parentValue.id}'})<-[r:BID{winner:TRUE}]-(b:User)
                  RETURN b`)
            .then((result) => result.records[0])
            .then((record) => record._fields[0].properties)
            .catch((e) => console.log("winner error: ", e));
    }, bids: (parentValue, _) => {
        return session
            .run(`MATCH(b:User)-[r:BID]->(d:Date{id:'${parentValue.id}'}) RETURN r`)
            .then((result) => result.records)
            .then((records) => {
            const list = records.map(record => (Object.assign({}, record._fields[0].properties)));
            return {
                id: `${parentValue.id}b`,
                list,
                cursor: null
            };
        })
            .catch((e) => console.log("bid error: ", e));
    } });
//# sourceMappingURL=DateItem.js.map