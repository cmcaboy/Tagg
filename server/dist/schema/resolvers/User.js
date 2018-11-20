"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generated_1 = require("../../types/generated");
const queue_1 = require("../../middleware/queue");
const neo4j_1 = require("../../db/neo4j");
const session = neo4j_1.driver.session();
exports.User = Object.assign({}, generated_1.UserResolvers.defaultResolvers, { hasDateOpen: (parentValue, _) => {
        console.log("following parentValue: ", parentValue);
        return session
            .run(`MATCH(a:User{id:'${parentValue.id}'}) 
                      WITH a, 
                      exists((a)-[:CREATE]->(:Date{open:TRUE})) as hasDateOpen
                      RETURN hasDateOpen`)
            .then((result) => result.records)
            .then((records) => {
            const hasDateOpen = records[0]._fields[0];
            console.log("hasDateOpen: ", hasDateOpen);
            return hasDateOpen;
        })
            .catch((e) => console.log("hasDateOpen error: ", e));
    }, distanceApart: (parentValue, _) => {
        if (!parentValue.hostId)
            return parentValue.distanceApart;
        return session
            .run(`MATCH(a:User{id:'${parentValue.hostId}'}),(b:User{id:'${parentValue.id}'})
              WITH  distance(point(a),point(b))*0.000621371 as distanceApart
              RETURN distanceApart`)
            .then((result) => result.records[0])
            .then((record) => record._fields[0])
            .catch((e) => console.log("distanceApart error: ", e));
    }, isFollowing: (parentValue, _) => {
        if (!parentValue.hostId)
            return parentValue.isFollowing;
        return session
            .run(`MATCH(a:User{id:'${parentValue.hostId}'}),(b:User{id:'${parentValue.id}'})
              WITH exists((a)-[:FOLLOWING]->(b)) as isFollowing
              RETURN isFollowing`)
            .then((result) => result.records[0])
            .then((record) => record._fields[0])
            .catch((e) => console.log("isFollowing error: ", e));
    }, following: (parentValue, _) => {
        console.log("following parentValue: ", parentValue);
        return session
            .run(`MATCH(a:User{id:'${parentValue.id}'})-[r:FOLLOWING]->(b:User) 
          WITH a,r,b, 
          exists((b)-[:CREATE]->(:Date{open:TRUE})) as hasDateOpen
          WHERE NOT (b)-[:BLOCK]->(a)
          RETURN b,hasDateOpen`)
            .then((result) => result.records)
            .then((records) => {
            console.log("following records: ", records);
            const list = records.map((record) => (Object.assign({}, record._fields[0].properties, { hasDateOpen: record._fields[1] })));
            console.log("following list: ", list);
            return {
                id: `${parentValue.id}f`,
                list,
                cursor: null
            };
        })
            .catch((e) => console.log("following error: ", e));
    }, bids: (parentValue, _) => {
        console.log("bids parentValue: ", parentValue);
        return session
            .run(`MATCH(a:User{id:'${parentValue.id}'})-[r:BID]->(d:Date)<-[:CREATE]-(b:User) RETURN b,d,r`)
            .then((result) => result.records)
            .then((records) => {
            console.log("bids records: ", records);
            const list = records.map(record => (Object.assign({}, record._fields[2].properties, { id: record._fields[1].properties.id, user: record._fields[0].properties })));
            console.log("bids list: ", list);
            return {
                id: `${parentValue.id}b`,
                list,
                cursor: null
            };
        })
            .catch((e) => console.log("bid error: ", e));
    }, dateRequests: (parentValue, _) => {
        console.log("dateRequests parentValue: ", parentValue);
        return session
            .run(`MATCH(a:User{id:'${parentValue.id}'})-[:CREATE]->(d:Date) 
          WITH a, d, size((d)<-[:BID]-(:User)) as num_bids, d.datetimeOfDate as order
          WHERE d.open=TRUE
          RETURN a,d,num_bids
          ORDER BY order DESC
        `)
            .then((result) => result.records)
            .then((records) => {
            console.log("dateRequests records: ", records);
            const list = records.map((record) => ({
                id: record._fields[1].properties.id,
                creator: record._fields[0].properties,
                creationTime: record._fields[1].properties.creationTime,
                datetimeOfDate: record._fields[1].properties.datetimeOfDate,
                description: record._fields[1].properties.description,
                num_bids: record._fields[2],
                open: record._fields[1].properties.open
            }));
            return {
                id: `${parentValue.id}d`,
                list,
                cursor: null
            };
        })
            .catch((e) => console.log("dateRequest error: ", e));
    }, queue: (parentValue, _) => queue_1.getQueue(parentValue), matchedDates: (parentValue, _) => {
        console.log("pareventValue.id: ", parentValue.id);
        const query = `MATCH(a:User{id:'${parentValue.id}'}),(b:User),(d:Date)
              WHERE (
                (a)-[:CREATE]->(d)<-[:BID{winner:TRUE}]-(b) OR
                (a)-[:BID{winner:TRUE}]->(d)<-[:CREATE]-(b)
              ) AND
                NOT (a)-[:BLOCK]->(b)
              RETURN b, d.id, d.description, d.datetimeOfDate
              ORDER BY d.datetimeOfDate`;
        console.log("query: ", query);
        return session
            .run(query)
            .then((result) => {
            return result.records;
        })
            .then((records) => {
            const list = records.map((record) => {
                return {
                    user: record._fields[0].properties,
                    matchId: record._fields[1],
                    id: record._fields[1],
                    description: record._fields[2],
                    datetimeOfDate: record._fields[3]
                };
            });
            if (list.length === 0) {
                return {
                    id: `${parentValue.id}m`,
                    list: [],
                    cursor: null
                };
            }
            const newCursor = null;
            console.log("matchedDates list: ", list);
            return {
                id: `${parentValue.id}m`,
                list,
                cursor: newCursor
            };
        })
            .catch((e) => console.log("matches error: ", e));
    } });
//# sourceMappingURL=User.js.map