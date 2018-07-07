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
const neo4j_1 = require("../db/neo4j");
const firestore_1 = require("../db/firestore");
const uuid = require('node-uuid');
const graphql_subscriptions_1 = require("graphql-subscriptions");
const pubsub = new graphql_subscriptions_1.PubSub();
const session = neo4j_1.driver.session();
const NEW_MESSAGE = 'NEW_MESSAGE';
const resolvers = {
    Subscription: {
        newMessageSub: {
            // The resolve method is executed after the subscribe method w/ filter
            resolve: (payload) => payload.newMessageSub.message,
            // For the withFilter function, the first argument is the tag that you are subscribing to.
            // The second argument is the filter.
            subscribe: graphql_subscriptions_1.withFilter(() => pubsub.asyncIterator(NEW_MESSAGE), (payload, args) => {
                console.log('payload: ', payload);
                console.log('args: ', args);
                return payload.newMessageSub.matchId === args.matchId;
            }),
        },
    },
    Query: {
        user: (_, args) => {
            console.log('args: ', args);
            if (args.id) {
                console.log('args: ', args);
                return session.run(`Match (n:User {id: '${args.id}'}) RETURN n`)
                    .then(result => result.records)
                    .then(records => {
                    console.log('records: ', records);
                    if (!records.length) {
                        return null;
                    }
                    const properties = records[0]._fields[0].properties;
                    return Object.assign({}, properties, { profilePic: !!properties.pics ? properties.pics[0] : null });
                })
                    .catch(e => console.log('id lookup error: ', e));
            }
            else {
                console.log('args: ', args);
                return session.run(`Match (n:User {token: '${args.token}'}) RETURN n`)
                    .then(result => result.records)
                    .then(records => {
                    console.log('records: ', records);
                    if (!records.length) {
                        return null;
                    }
                    const properties = records[0]._fields[0].properties;
                    return Object.assign({}, properties, { profilePic: !!properties.pics ? properties.pics[0] : null });
                })
                    .catch(e => console.log('token lookup error: ', e));
            }
        },
        match: (_, args) => console.log('matchId: ', args.matchId)
    },
    User: {
        likes: (parentValue, args) => {
            return session
                .run(`MATCH(a:User{id:'${parentValue.id}'})-[r:LIKES]->(b:User) RETURN b`)
                .then(result => result.records)
                .then(records => records.map(record => record._fields[0].properties))
                .catch(e => console.log('likes error: ', e));
        },
        dislikes: (parentValue, args) => {
            return session
                .run(`MATCH(a:User{id:'${parentValue.id}'})-[r:DISLIKES]->(b:User) RETURN b`)
                .then(result => result.records)
                .then(records => records.map(record => record._fields[0].properties))
                .catch(e => console.log('dislikes error: ', e));
        },
        matches: (parentValue, args) => {
            let query = '';
            if (args.id) {
                query = `MATCH(a:User{id:'${parentValue.id}'})-[r:LIKES]->(b:User{id:'${args.id}'}) where r.matchId IS NOT NULL RETURN b,r.matchId`;
            }
            else {
                query = `MATCH(a:User{id:'${parentValue.id}'})-[r:LIKES]->(b:User) where r.matchId IS NOT NULL RETURN b,r.matchId`;
            }
            return session
                .run(query)
                .then(result => {
                return result.records;
            })
                .then(records => {
                return records.map(record => {
                    return {
                        user: record._fields[0].properties,
                        matchId: record._fields[1]
                    };
                });
            })
                .catch(e => console.log('matches error: ', e));
        },
        queue: (parentValue, args) => {
            return session
                .run(`MATCH(a:User{id:'${parentValue.id}'}),(b:User) 
                    where NOT (a)-[:LIKES|DISLIKES]->(b) AND 
                    NOT b.id='${parentValue.id}' AND
                    NOT b.gender='${parentValue.gender}'
                    RETURN b`)
                .then(result => result.records)
                .then(records => records.map(record => record._fields[0].properties))
                .catch(e => console.log('queue error: ', e));
        }
    },
    Match: {
        messages: (parentValue, args) => __awaiter(this, void 0, void 0, function* () {
            if (!parentValue.matchId) {
                return [];
            }
            const data = yield firestore_1.db.collection(`matches/${parentValue.matchId}/messages`).orderBy("date", "desc").limit(50).get();
            return data.docs.map(doc => {
                const docData = doc.data();
                return {
                    id: docData.id,
                    name: docData.name,
                    date: docData.date,
                    message: docData.message
                };
            });
        }),
        lastMessage: (parentValue, args) => __awaiter(this, void 0, void 0, function* () {
            if (!parentValue.matchId) {
                return null;
            }
            try {
                // Can use a desc option if orderBy if I need to get opposite order.
                // citiesRef.orderBy("state").orderBy("population", "desc")
                const data = yield firestore_1.db.collection(`matches/${parentValue.matchId}/messages`).orderBy("date", "desc").limit(1).get();
                if (!data.docs) {
                    return null;
                }
                const messages = data.docs.map(doc => {
                    const docData = doc.data();
                    return {
                        id: docData.id,
                        name: docData.name,
                        date: docData.date,
                        message: docData.message
                    };
                });
                // This array should only have 1 element, but I want to return just the element rather than a 1 length array.
                return messages[0];
            }
            catch (e) {
                console.log('error fetching last message: ', e);
                return null;
            }
        })
    },
    Mutation: {
        dislikeUser: (_, args) => {
            const query = `MATCH (a:User {id:'${args.id}'}), (b:User {id:'${args.dislikedId}'}) MERGE (a)-[r:DISLIKES]->(b) return a,b,r`;
            return session
                .run(query)
                .then(result => {
                return result.records;
            })
                .then(records => records[0]._fields[0].properties)
                .catch(e => console.log('disLikeUser error: ', e));
        },
        editUser: (_, args) => {
            const isBoolean = val => 'boolean' === typeof val;
            console.log('args: ', args);
            let query = `MATCH(a:User{id: '${args.id}'}) SET `;
            !!args.name && (query = query + `a.name='${args.name}',`);
            isBoolean(args.active) && (query = query + `a.active=${args.active},`);
            !!args.email && (query = query + `a.email='${args.email}',`);
            !!args.gender && (query = query + `a.gender='${args.gender}',`);
            !!args.age && (query = query + `a.age=${args.age},`);
            !!args.description && (query = query + `a.description='${args.description}',`);
            !!args.school && (query = query + `a.school='${args.school}',`);
            !!args.work && (query = query + `a.work='${args.work}',`);
            !!args.token && (query = query + `a.token='${args.token}',`);
            isBoolean(args.sendNotifications) && (query = query + `a.sendNotifications=${args.sendNotifications},`);
            !!args.distance && (query = query + `a.distance=${args.distance},`);
            !!args.latitude && (query = query + `a.latitude=${args.latitude},`);
            !!args.longitude && (query = query + `a.longitude=${args.longitude},`);
            !!args.minAgePreference && (query = query + `a.minAgePreference=${args.minAgePreference},`);
            !!args.maxAgePreference && (query = query + `a.maxAgePreference=${args.maxAgePreference},`);
            !!args.pics && (query = query + `a.pics=[${args.pics.map(pic => `"${pic}"`)}],`);
            console.log('query slice: ', query.slice(0, -1));
            query = query.slice(-1) === ',' ? query.slice(0, -1) : query;
            query = query + ` RETURN a`;
            console.log('query: ', query);
            return session
                .run(query)
                .then(result => {
                console.log('result: ', result);
                return result.records;
            })
                .then(records => records[0]._fields[0].properties)
                .catch(e => console.log('editUser error: ', e));
        },
        likeUser: (_, args) => __awaiter(this, void 0, void 0, function* () {
            // command to create like
            const mutate = `MATCH (a:User {id:'${args.id}'}), (b:User {id:'${args.likedId}'}) MERGE (a)-[r:LIKES]->(b) return b`;
            // query to check to see if like is mutual
            const query = `MATCH (a:User {id:'${args.id}'})<-[r:LIKES]-(b:User {id:'${args.likedId}'}) return b`;
            // Create the like in neo4j
            const result = yield session.run(mutate);
            const user = result.records[0]._fields[0].properties;
            // Check Match
            const resultMatch = yield session.run(query);
            // Check to see if the like is mutual
            if (resultMatch.records.length > 0) {
                const matchId = uuid.v1();
                try {
                    yield session.run(`MATCH (a:User {id:'${args.id}'})<-[r:LIKES]-(b:User {id:'${args.likedId}'}) SET r.matchId='${matchId}'`);
                    yield session.run(`MATCH (a:User {id:'${args.id}'})-[r:LIKES]->(b:User {id:'${args.likedId}'}) SET r.matchId='${matchId}'`);
                    yield firestore_1.db.collection(`matches`).doc(`${matchId}`).set({
                        user1: args.id,
                        user2: args.likedId,
                        matchTime: new Date()
                    });
                }
                catch (e) {
                    console.log('likeUser error creating match: ', e);
                }
                return { id: args.likedId, name: user.name, match: true };
            }
            return { id: args.likedId, name: user.name, match: false };
        }),
        newUser: (_, args) => {
            console.log('args: ', args);
            let query = `CREATE(a:User{
                id: '${args.id}',
                name: '${args.name}',
                active: ${args.active},
                email: '${args.email}',
                gender: '${args.gender}',`;
            !!args.age && (query = query + `age:${args.age},`);
            !!args.description && (query = query + `description:'${args.description}',`);
            !!args.school && (query = query + `school:'${args.school}',`);
            !!args.work && (query = query + `work:'${args.work}',`);
            !!args.token && (query = query + `token:'${args.token}',`);
            !!args.sendNotifications && (query = query + `sendNotifications:${args.sendNotifications},`);
            !!args.distance && (query = query + `distance:${args.distance},`);
            !!args.latitude && (query = query + `latitude:${args.latitude},`);
            !!args.longitude && (query = query + `longitude:${args.longitude},`);
            !!args.minAgePreference && (query = query + `minAgePreference:${args.minAgePreference},`);
            !!args.maxAgePreference && (query = query + `maxAgePreference:${args.maxAgePreference},`);
            !!args.pics && (query = query + `pics:[${args.pics.map(pic => `"${pic}"`)}],`);
            query = query.slice(-1) === ',' ? query.slice(0, -1) : query;
            query = query + `}) RETURN a`;
            console.log('query: ', query);
            return session
                .run(query)
                .then(result => {
                console.log('result: ', result);
                return result.records;
            })
                .then(records => records[0]._fields[0].properties)
                .catch(e => console.log('newUser error: ', e));
        },
        newMessage: (_, args) => __awaiter(this, void 0, void 0, function* () {
            //console.log('args: ',args);
            const message = {
                id: args.id,
                name: args.name,
                message: args.message,
                //date: moment().format('MMMM Do YYYY, h:mm:ss a')
                date: new Date()
            };
            try {
                yield firestore_1.db.collection(`matches/${args.matchId}/messages`).add(message);
            }
            catch (e) {
                console.error(`error writing new message to ${args.matchId}: ${e}`);
                return null;
            }
            // Call our subscription asynchronously so we don't slow down our client.
            const asyncFunc = () => __awaiter(this, void 0, void 0, function* () {
                console.log('in pubsub async');
                console.log('args.matchId: ', args.matchId);
                console.log('message: ', message);
                console.log('sub tag: ', NEW_MESSAGE);
                pubsub.publish(NEW_MESSAGE, { newMessageSub: { message, matchId: args.matchId } });
            });
            asyncFunc();
            console.log(`${args.name} posted message to matchId ${args.matchId}`);
            return message;
        })
    }
};
exports.default = resolvers;
//# sourceMappingURL=resolvers.js.map