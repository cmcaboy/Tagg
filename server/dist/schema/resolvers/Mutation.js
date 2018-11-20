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
const uuid = require("node-uuid");
const generated_1 = require("../../types/generated");
const defaults_1 = require("../defaults");
const neo4j_1 = require("../../db/neo4j");
const firestore_1 = require("../../db/firestore");
const queue_1 = require("../../middleware/queue");
const format_1 = require("../../middleware/format");
const index_1 = require("../../pubsub/index");
const subscriptions_1 = require("../../pubsub/subscriptions");
const newMessagePush_1 = require("../../middleware/newMessagePush");
const createDatePush_1 = require("../../middleware/createDatePush");
const chooseWinnerPush_1 = require("../../middleware/chooseWinnerPush");
const session = neo4j_1.driver.session();
exports.Mutation = Object.assign({}, generated_1.MutationResolvers.defaultResolvers, { editUser: (_, args) => {
        const isBoolean = (val) => "boolean" === typeof val;
        console.log("args: ", args);
        let query = `MATCH(a:User{id: '${args.id}'}) SET `;
        !!args.name && (query = query + `a.name='${args.name}',`);
        isBoolean(args.active) && (query = query + `a.active=${args.active},`);
        !!args.email && (query = query + `a.email='${args.email.toLowerCase()}',`);
        !!args.gender && (query = query + `a.gender='${args.gender}',`);
        !!args.age && (query = query + `a.age=${args.age},`);
        !!args.description &&
            (query = query + `a.description="${args.description}",`);
        !!args.school && (query = query + `a.school="${args.school}",`);
        !!args.work && (query = query + `a.work="${args.work}",`);
        !!args.token && (query = query + `a.token='${args.token}',`);
        !!args.registerDateTime &&
            (query = query + `a.registerDateTime='${args.registerDateTime}',`);
        isBoolean(args.sendNotifications) &&
            (query = query + `a.sendNotifications=${args.sendNotifications},`);
        !!args.distance && (query = query + `a.distance=${args.distance},`);
        !!args.latitude && (query = query + `a.latitude=${args.latitude},`);
        !!args.longitude && (query = query + `a.longitude=${args.longitude},`);
        !!args.minAgePreference &&
            (query = query + `a.minAgePreference=${args.minAgePreference},`);
        !!args.maxAgePreference &&
            (query = query + `a.maxAgePreference=${args.maxAgePreference},`);
        !!args.followerDisplay &&
            (query = query + `a.followerDisplay='${args.followerDisplay}',`);
        isBoolean(args.objectionable) &&
            (query = query + `a.objectionable=${args.objectionable},`);
        isBoolean(args.viewObjectionable) &&
            (query = query + `a.viewObjectionable=${args.viewObjectionable},`);
        !!args.pics &&
            (query = query + `a.pics=[${args.pics.map(pic => `"${pic}"`)}],`);
        console.log("query slice: ", query.slice(0, -1));
        query = query.slice(-1) === "," ? query.slice(0, -1) : query;
        query = query + ` RETURN a`;
        console.log("query: ", query);
        return session
            .run(query)
            .then((result) => {
            console.log("result: ", result);
            return result.records;
        })
            .then((records) => records[0]._fields[0].properties)
            .catch((e) => console.log("editUser error: ", e));
    }, editUserQueue: (_, args) => __awaiter(this, void 0, void 0, function* () {
        const isBoolean = (val) => "boolean" === typeof val;
        console.log("args: ", args);
        let query = `MATCH(a:User{id: '${args.id}'}) SET `;
        isBoolean(args.sendNotifications) &&
            (query = query + `a.sendNotifications=${args.sendNotifications},`);
        !!args.distance && (query = query + `a.distance=${args.distance},`);
        !!args.minAgePreference &&
            (query = query + `a.minAgePreference=${args.minAgePreference},`);
        !!args.maxAgePreference &&
            (query = query + `a.maxAgePreference=${args.maxAgePreference},`);
        query = query.slice(-1) === "," ? query.slice(0, -1) : query;
        query = query + ` RETURN a`;
        console.log("query: ", query);
        try {
            yield session.run(query);
        }
        catch (e) {
            console.log("editUserQueue error: ", e);
            return null;
        }
        let result;
        try {
            result = yield queue_1.getQueue({ id: args.id, followerDisplay: null });
        }
        catch (e) {
            console.log("editUserQueue error: ", e);
            return null;
        }
        return result;
    }), newUser: (_, tempArgs) => __awaiter(this, void 0, void 0, function* () {
        console.log("tempArgs: ", tempArgs);
        const args = Object.assign({}, defaults_1.newUserDefaults, tempArgs);
        let idAlreadyExist;
        try {
            idAlreadyExist = yield session.run(`MATCH (a:User{id: '${args.id}'}) return a.id`);
        }
        catch (e) {
            console.log("Error checking if user already exists");
            return { id: null };
        }
        if (idAlreadyExist.records.length) {
            console.log("Email already registered");
            return { id: false };
        }
        const isBoolean = (val) => "boolean" === typeof val;
        let query = `CREATE(a:User{
              id: '${args.id}',
              name: '${args.name}',
              active: ${args.active},
              email: '${args.email.toLowerCase()}',
              gender: '${args.gender}',`;
        !!args.age && (query = query + `age:${args.age},`);
        !!args.description &&
            (query = query + `description:"${args.description}",`);
        !!args.school && (query = query + `school:"${args.school}",`);
        !!args.work && (query = query + `work:"${args.work}",`);
        !!args.token && (query = query + `token:'${args.token}',`);
        !!args.registerDateTime &&
            (query = query + `registerDateTime:'${args.registerDateTime}',`);
        !!args.sendNotifications &&
            (query = query + `sendNotifications:${args.sendNotifications},`);
        !!args.distance && (query = query + `distance:${args.distance},`);
        !!args.latitude && (query = query + `latitude:${args.latitude},`);
        !!args.longitude && (query = query + `longitude:${args.longitude},`);
        !!args.minAgePreference &&
            (query = query + `minAgePreference:${args.minAgePreference},`);
        !!args.maxAgePreference &&
            (query = query + `maxAgePreference:${args.maxAgePreference},`);
        !!args.followerDisplay &&
            (query = query + `followerDisplay:'${args.followerDisplay}',`);
        isBoolean(args.viewObjectionable) &&
            (query = query + `viewObjectionable:${args.viewObjectionable},`);
        isBoolean(args.objectionable) &&
            (query = query + `objectionable:${args.objectionable},`);
        !!args.pics &&
            (query = query + `pics:[${args.pics.map(pic => `"${pic}"`)}],`);
        query = query.slice(-1) === "," ? query.slice(0, -1) : query;
        query = query + `}) RETURN a`;
        console.log("query: ", query);
        return session
            .run(query)
            .then((result) => {
            console.log("result: ", result);
            return result.records;
        })
            .then((records) => records[0]._fields[0].properties)
            .catch((e) => console.log("newUser error: ", e));
    }), newMessage: (_, args) => __awaiter(this, void 0, void 0, function* () {
        const message = {
            _id: args._id,
            name: args.name,
            text: args.text,
            avatar: args.avatar,
            createdAt: format_1.getCurrentDateFirestore(),
            order: args.order,
            uid: args.uid
        };
        try {
            yield firestore_1.db.collection(`matches/${args.matchId}/messages`).add(message);
        }
        catch (e) {
            console.error(`error writing new message to ${args.matchId}: ${e}`);
            return null;
        }
        const asyncFunc = () => __awaiter(this, void 0, void 0, function* () {
            console.log("in pubsub async");
            index_1.pubsub.publish(subscriptions_1.NEW_MESSAGE, {
                newMessageSub: { message, matchId: args.matchId }
            });
            newMessagePush_1.newMessagePush({
                matchId: args.matchId,
                otherId: args.uid,
                otherName: args.name,
                otherPic: args.avatar,
                text: args.text,
                id: args.receiverId
            });
        });
        asyncFunc();
        console.log(`${args.name} posted message to matchId ${args.matchId}`);
        return message;
    }), follow: (_, args) => {
        let query;
        const { isFollowing, id, followId } = args;
        console.log("follow start");
        console.log("args: ", args);
        console.log("isFollowing: ", isFollowing);
        console.log("followId: ", followId);
        console.log("id: ", id);
        if (isFollowing) {
            query = `MATCH (a:User {id:'${id}'}), (b:User {id:'${followId}'}) MERGE (a)-[r:FOLLOWING]->(b) RETURN b`;
        }
        else {
            query = `MATCH (a:User {id:'${id}'})-[r:FOLLOWING]->(b:User {id:'${followId}'}) DELETE r RETURN b`;
        }
        console.log("query: ", query);
        return session
            .run(query)
            .then((result) => {
            console.log("result: ", result);
            return result.records[0];
        })
            .then((record) => (Object.assign({}, record._fields[0].properties, { isFollowing })))
            .catch((e) => console.log("follow mutation error: ", e));
    }, unFollow: (_, args) => {
        const query = `MATCH (a:User {id:'${args.id}'})-[r:FOLLOWING]->(b:User {id:'${args.unFollowId}'}) DELETE r RETURN b`;
        return session
            .run(query)
            .then((result) => {
            return result.records[0];
        })
            .then((record) => (Object.assign({}, record._fields[0].properties, { isFollowing: false })))
            .catch((e) => console.log("follow mutation error: ", e));
    }, bid: (_, args) => {
        const datetimeOfBid = format_1.getCurrentDateNeo();
        const bidId = uuid();
        let query = `MATCH (a:User {id:'${args.id}'}), (d:Date {id:'${args.dateId}'}) 
              MERGE (a)-[r:BID{id: '${bidId}',datetimeOfBid: '${datetimeOfBid}',`;
        !!args.bidPlace &&
            (query = query + `bidPlace:"${args.bidPlace}",`) +
                !!args.bidDescription &&
            (query = query + `bidDescription:"${args.bidDescription}",`);
        query = query.slice(-1) === "," ? query.slice(0, -1) : query;
        query = query + `}]->(d) RETURN r`;
        console.log("query in bid: ", query);
        return session
            .run(query)
            .then((result) => {
            return result.records[0];
        })
            .then((record) => (Object.assign({}, record._fields[0].properties)))
            .catch((e) => console.log("bid mutation error: ", e));
    }, createDate: (_, args) => __awaiter(this, void 0, void 0, function* () {
        const creationTime = format_1.getCurrentDateNeo();
        const dateId = uuid();
        let query = `CREATE (d:Date {id:'${dateId}',creator:'${args.id}',creationTime:'${creationTime}',open:TRUE,`;
        !!args.datetimeOfDate &&
            (query = query + `datetimeOfDate:"${args.datetimeOfDate}",`) +
                !!args.description &&
            (query = query + `description:"${args.description}",`);
        query = query.slice(-1) === "," ? query.slice(0, -1) : query;
        query = query + `}) RETURN d`;
        console.log("query in createDate: ", query);
        let rawDate;
        let date;
        try {
            rawDate = yield session.run(query);
            date = rawDate.records[0]._fields[0].properties;
        }
        catch (e) {
            console.log("createDate mutation error d node: ", e);
            return null;
        }
        try {
            yield session.run(`MATCH (a:User {id:'${args.id}'}), (d:Date {id:'${dateId}'}) MERGE (a)-[r:CREATE]->(d)`);
        }
        catch (e) {
            console.log("createDate mutation error relationship create: ", e);
            return null;
        }
        createDatePush_1.createDatePush(args.id, date);
        return date;
    }), chooseWinner: (_, args) => __awaiter(this, void 0, void 0, function* () {
        console.log("choosewinner args: ", args);
        const { id, winnerId, dateId } = args;
        let date;
        try {
            const data = yield session.run(`MATCH (a:User{id:'${id}'})-[:CREATE]->(d:Date{id:'${dateId}'})<-[r:BID]-(b:User{id:'${winnerId}'}) 
                  WITH d,a,b,r
                  SET r.winner=TRUE,
                  d.winner='${winnerId}',
                  d.open=FALSE
                  return d,a,b`);
            console.log("data: ", data);
            date = Object.assign({}, data.records[0]._fields[0].properties, { creator: data.records[0]._fields[1].properties, winner: data.records[0]._fields[2].properties });
        }
        catch (e) {
            console.error("Error updating winner value on choosewinner: ", e);
            return null;
        }
        try {
            yield firestore_1.db
                .collection(`matches`)
                .doc(dateId)
                .set({
                user1: id,
                user2: winnerId,
                matchTime: format_1.getCurrentDateFirestore(),
                datetimeOfDate: date.datetimeOfDate,
                description: date.description
            });
        }
        catch (e) {
            console.error(`chooseWinner error updating Firestore: ${e}`);
            return null;
        }
        chooseWinnerPush_1.chooseWinnerPushWinner(date);
        chooseWinnerPush_1.chooseWinnerPushLoser(date);
        console.log("chooseWinner date: ", date);
        return date;
    }), flag: (_, args) => {
        const { id, flaggedId, block } = args;
        if (block) {
            session
                .run(`MATCH (a:User{id:'${id}'}), (b:User{id:'${flaggedId}'}) 
            CREATE (a)-[r:BLOCK { active: true }]->(b)
            return a`)
                .then((result) => {
                return result.records[0];
            })
                .then((record) => (Object.assign({}, record._fields[0].properties)))
                .then((b) => console.log("Blocked user: ", b))
                .catch((e) => console.log("Error blocking user: ", e));
        }
        return session
            .run(`MATCH (a:User{id:'${flaggedId}'}) set a.objectionable = true RETURN a`)
            .then((result) => {
            return result.records[0];
        })
            .then((record) => (Object.assign({}, record._fields[0].properties)))
            .catch((e) => console.log("Error flagging user for objectionable content: ", e));
    }, block: (_, args) => {
        console.log("args: ", args);
        const { id, blockedId } = args;
        return session
            .run(`MATCH (a:User{id:'${id}'}), (b:User{id:'${blockedId}'}) 
          CREATE (a)-[r:BLOCK { active: true }]->(b)
          return b`)
            .then((result) => {
            return result.records[0];
        })
            .then((record) => (Object.assign({}, record._fields[0].properties)))
            .catch((e) => console.log("Error blocking user: ", e));
    } });
//# sourceMappingURL=Mutation.js.map