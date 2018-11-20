"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const generated_1 = require("../../types/generated");
const firestore_1 = require("../../db/firestore");
const neo4j_1 = require("../../db/neo4j");
const variables_1 = require("./variables");
const session = neo4j_1.driver.session();
exports.Query = Object.assign({}, generated_1.QueryResolvers.defaultResolvers, { user: (_, args) => {
        console.log("user args: ", args);
        if (args.id) {
            console.log("args: ", args);
            return session
                .run(`Match (n:User {id: '${args.id}'}) RETURN n`)
                .then((result) => result.records)
                .then((records) => {
                console.log("records: ", records);
                if (!records.length) {
                    return null;
                }
                const properties = records[0]._fields[0].properties;
                return Object.assign({}, properties, { profilePic: !!properties.pics ? properties.pics[0] : null, hostId: !!args.hostId ? args.hostId : null });
            })
                .catch((e) => console.log("id lookup error: ", e));
        }
        else {
            console.log("Error, no id inputted!");
            return null;
        }
    }, messages: (_, args) => __awaiter(this, void 0, void 0, function* () {
        console.log("in moreMessages");
        console.log("args: ", args);
        const query = firestore_1.db
            .collection(`matches/${args.id}/messages`)
            .orderBy("order")
            .limit(variables_1.MESSAGE_PAGE_LENGTH);
        let data;
        try {
            data = yield query.get();
        }
        catch (e) {
            console.log("error fetching more messages from firestore: ", e);
            return {
                id: args.id,
                list: [],
                cursor: null
            };
        }
        const messages = data.docs.map((doc) => {
            const docData = doc.data();
            return {
                name: docData.name,
                avatar: docData.avatar,
                uid: docData.uid,
                text: docData.text,
                createdAt: docData.createdAt,
                order: docData.order,
                _id: docData._id
            };
        });
        if (messages.length === 0) {
            return {
                id: args.id,
                list: [],
                cursor: null
            };
        }
        const cursor = messages.length >= variables_1.MESSAGE_PAGE_LENGTH
            ? messages[messages.length - 1].order
            : null;
        console.log("messages in moreMessages: ", messages);
        console.log("newCursor: ", cursor);
        return {
            id: args.id,
            list: messages,
            cursor
        };
    }), date: (_, args) => {
        return session
            .run(`MATCH(d:Date{id:'${args.id}'}) 
              RETURN d`)
            .then((result) => result.records[0])
            .then((record) => record._fields[0].properties)
            .catch((e) => {
            console.log("date error: ", e);
            return null;
        });
    }, dates: (_, __) => {
        throw new Error("Resolver not implemented");
    }, otherBids: (_, args) => {
        console.log("otherBids args: ", args);
        return session
            .run(`MATCH(b:User)-[r:BID]->(d:Date{id:'${args.id}'}) 
          WITH b,r,d, r.datetimeOfBid as order
          RETURN b,r
          ORDER BY order DESC
        `)
            .then((result) => result.records)
            .then((records) => {
            const list = records.map((record) => ({
                id: record._fields[0].properties.id,
                datetimeOfBid: record._fields[1].properties.datetimeOfBid,
                bidDescription: record._fields[1].properties.bidDescription,
                bidPlace: record._fields[1].properties.bidPlace,
                bidUser: Object.assign({}, record._fields[0].properties, { profilePic: !!record._fields[0].properties.pics
                        ? record._fields[0].properties.pics[0]
                        : null })
            }));
            return {
                id: `${args.id}b`,
                list,
                cursor: null
            };
        })
            .catch((e) => console.log("bid error: ", e));
    }, moreMessages: (_, args) => __awaiter(this, void 0, void 0, function* () {
        console.log("in moreMessages");
        console.log("args: ", args);
        if (!args.cursor) {
            return {
                id: args.id,
                list: [],
                cursor: null
            };
        }
        let cursor = parseInt(args.cursor);
        const query = firestore_1.db
            .collection(`matches/${args.id}/messages`)
            .orderBy("order")
            .startAfter(cursor)
            .limit(variables_1.MESSAGE_PAGE_LENGTH);
        let data;
        try {
            data = yield query.get();
        }
        catch (e) {
            console.log("error fetching more messages from firestore: ", e);
            return {
                id: args.id,
                list: [],
                cursor
            };
        }
        const messages = data.docs.map((doc) => {
            const docData = doc.data();
            return {
                name: docData.name,
                avatar: docData.avatar,
                uid: docData.uid,
                text: docData.text,
                createdAt: docData.createdAt,
                order: docData.order,
                _id: docData._id
            };
        });
        if (messages.length === 0) {
            return {
                id: args.id,
                list: [],
                cursor
            };
        }
        const newCursor = messages.length >= variables_1.MESSAGE_PAGE_LENGTH
            ? messages[messages.length - 1].order
            : null;
        console.log("messages in moreMessages: ", messages);
        console.log("newCursor: ", newCursor);
        return {
            id: args.id,
            list: messages,
            cursor: newCursor
        };
    }), moreQueue: (_, args) => __awaiter(this, void 0, void 0, function* () {
        console.log("in Queue");
        console.log("args: ", args);
        const { id } = args;
        let followQuery;
        switch (args.followerDisplay) {
            case "Following Only":
                followQuery = `AND isFollowing`;
                break;
            case "Non-Following Only":
                followQuery = `AND NOT isFollowing`;
                break;
            default:
                followQuery = ``;
        }
        let viewObjectionable;
        try {
            const viewObjectionableRaw = yield session.run(`MATCH(a:User{id:'${id}}) return a.viewObjectionable`);
            const viewObjectionableResult = viewObjectionableRaw.records[0].fields[0];
            if (viewObjectionableResult) {
                viewObjectionable = `AND viewObjectionable`;
            }
            else {
                viewObjectionable = `AND NOT viewObjectionable`;
            }
        }
        catch (e) {
            console.log("Not able to objection viewObjectionable preference. Defaulting to view non-objectionable content");
            viewObjectionable = `AND NOT viewObjectionable`;
        }
        if (!args.cursor) {
            console.log("No cursor passed in. You must be at the end of the list. No more values to retreive.");
            return {
                list: [],
                cursor: null,
                id: `${id}q`
            };
        }
        else if (!id) {
            console.error("Error! No id passed in!");
        }
        return session
            .run(`MATCH(a:User{id:'${id}'}),(b:User) 
              WITH a,b, size((b)<-[:FOLLOWING]-()) as num_likes,
              ((distance(point(a),point(b))*0.000621371)*(1/toFloat((SIZE((b)<-[:FOLLOWING]-())+1)))) as order,
              distance(point(a),point(b))*0.000621371 as distanceApart,
              exists((a)-[:FOLLOWING]->(b)) as isFollowing,
              exists((b)-[:CREATE]->(:Date{open:TRUE})) as hasDateOpen
              where
              NOT (b)-[:BLOCK]->(a) AND
              NOT b.id=a.id AND
              NOT b.gender=a.gender AND
              distanceApart < a.distance AND
              order > ${args.cursor}
              ${followQuery}
              ${viewObjectionable}
              RETURN b, distanceApart, num_likes, order, isFollowing, hasDateOpen
              ORDER BY order
              LIMIT ${variables_1.QUEUE_PAGE_LENGTH}`)
            .then((result) => result.records)
            .then((records) => {
            const list = records.map((record) => {
                return Object.assign({}, record._fields[0].properties, { distanceApart: record._fields[1], order: record._fields[3], profilePic: !!record._fields[0].properties.pics
                        ? record._fields[0].properties.pics[0]
                        : null, isFollowing: record._fields[4], hasDateOpen: record._fields[5] });
            });
            if (list.length === 0) {
                return {
                    list: [],
                    cursor: null,
                    id: `${id}q`
                };
            }
            const newCursor = list.length >= variables_1.QUEUE_PAGE_LENGTH ? list[list.length - 1].order : null;
            return {
                list,
                cursor: newCursor,
                id: `${id}q`
            };
        })
            .catch((e) => console.log("moreQueue error: ", e));
    }), moreDates: (_, __) => {
        throw new Error("Resolver not implemented");
    }, moreDateBids: (_, __) => {
        throw new Error("Resolver not implemented");
    }, moreFollowing: (_, __) => {
        throw new Error("Resolver not implemented");
    } });
//# sourceMappingURL=Query.js.map