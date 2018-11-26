"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var neo4j_1 = require("../db/neo4j");
var firestore_1 = require("../db/firestore");
var uuid = require('node-uuid');
var session = neo4j_1.driver.session();
var resolvers = {
    Query: {
        user: function (_, args) {
            console.log('args: ', args);
            if (args.id) {
                console.log('args: ', args);
                return session.run("Match (n:User {id: '" + args.id + "'}) RETURN n")
                    .then(function (result) { return result.records; })
                    .then(function (records) {
                    console.log('records: ', records);
                    if (!records.length) {
                        return null;
                    }
                    var properties = records[0]._fields[0].properties;
                    return __assign({}, properties, { profilePic: !!properties.pics ? properties.pics[0] : null });
                })
                    .catch(function (e) { return console.log('id lookup error: ', e); });
            }
            else {
                console.log('args: ', args);
                return session.run("Match (n:User {token: '" + args.token + "'}) RETURN n")
                    .then(function (result) { return result.records; })
                    .then(function (records) {
                    console.log('records: ', records);
                    if (!records.length) {
                        return null;
                    }
                    var properties = records[0]._fields[0].properties;
                    return __assign({}, properties, { profilePic: !!properties.pics ? properties.pics[0] : null });
                })
                    .catch(function (e) { return console.log('token lookup error: ', e); });
            }
        },
        match: function (_, args) { return console.log('matchId: ', args.matchId); }
    },
    User: {
        likes: function (parentValue, args) {
            return session
                .run("MATCH(a:User{id:'" + parentValue.id + "'})-[r:LIKES]->(b:User) RETURN b")
                .then(function (result) { return result.records; })
                .then(function (records) { return records.map(function (record) { return record._fields[0].properties; }); })
                .catch(function (e) { return console.log('likes error: ', e); });
        },
        dislikes: function (parentValue, args) {
            return session
                .run("MATCH(a:User{id:'" + parentValue.id + "'})-[r:DISLIKES]->(b:User) RETURN b")
                .then(function (result) { return result.records; })
                .then(function (records) { return records.map(function (record) { return record._fields[0].properties; }); })
                .catch(function (e) { return console.log('dislikes error: ', e); });
        },
        matches: function (parentValue, args) {
            var query = '';
            if (args.id) {
                query = "MATCH(a:User{id:'" + parentValue.id + "'})-[r:LIKES]->(b:User{id:'" + args.id + "'}) where r.matchId IS NOT NULL RETURN b,r.matchId";
            }
            else {
                query = "MATCH(a:User{id:'" + parentValue.id + "'})-[r:LIKES]->(b:User) where r.matchId IS NOT NULL RETURN b,r.matchId";
            }
            return session
                .run(query)
                .then(function (result) {
                return result.records;
            })
                .then(function (records) {
                return records.map(function (record) {
                    return {
                        user: record._fields[0].properties,
                        matchId: record._fields[1]
                    };
                });
            })
                .catch(function (e) { return console.log('matches error: ', e); });
        },
        queue: function (parentValue, args) {
            return session
                .run("MATCH(a:User{id:'" + parentValue.id + "'}),(b:User) \n                    where NOT (a)-[:LIKES|DISLIKES]->(b) AND \n                    NOT b.id='" + parentValue.id + "' AND\n                    NOT b.gender='" + parentValue.gender + "'\n                    RETURN b")
                .then(function (result) { return result.records; })
                .then(function (records) { return records.map(function (record) { return record._fields[0].properties; }); })
                .catch(function (e) { return console.log('queue error: ', e); });
        }
    },
    Match: {
        messages: function (parentValue, args) { return __awaiter(_this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!parentValue.matchId) {
                            return [2 /*return*/, []];
                        }
                        return [4 /*yield*/, firestore_1.db.collection("matches/" + parentValue.matchId + "/messages").orderBy("date", "desc").limit(50).get()];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data.docs.map(function (doc) {
                                var docData = doc.data();
                                return {
                                    id: docData.id,
                                    name: docData.name,
                                    date: docData.date,
                                    message: docData.message
                                };
                            })];
                }
            });
        }); },
        lastMessage: function (parentValue, args) { return __awaiter(_this, void 0, void 0, function () {
            var data, messages, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!parentValue.matchId) {
                            return [2 /*return*/, null];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, firestore_1.db.collection("matches/" + parentValue.matchId + "/messages").orderBy("date", "desc").limit(1).get()];
                    case 2:
                        data = _a.sent();
                        if (!data.docs) {
                            return [2 /*return*/, null];
                        }
                        messages = data.docs.map(function (doc) {
                            var docData = doc.data();
                            return {
                                id: docData.id,
                                name: docData.name,
                                date: docData.date,
                                message: docData.message
                            };
                        });
                        // This array should only have 1 element, but I want to return just the element rather than a 1 length array.
                        return [2 /*return*/, messages[0]];
                    case 3:
                        e_1 = _a.sent();
                        console.log('error fetching last message: ', e_1);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        }); }
    },
    Mutation: {
        dislikeUser: function (_, args) {
            var query = "MATCH (a:User {id:'" + args.id + "'}), (b:User {id:'" + args.dislikedId + "'}) MERGE (a)-[r:DISLIKES]->(b) return a,b,r";
            return session
                .run(query)
                .then(function (result) {
                return result.records;
            })
                .then(function (records) { return records[0]._fields[0].properties; })
                .catch(function (e) { return console.log('disLikeUser error: ', e); });
        },
        editUser: function (_, args) {
            var isBoolean = function (val) { return 'boolean' === typeof val; };
            console.log('args: ', args);
            var query = "MATCH(a:User{id: '" + args.id + "'}) SET ";
            !!args.name && (query = query + ("a.name='" + args.name + "',"));
            isBoolean(args.active) && (query = query + ("a.active=" + args.active + ","));
            !!args.email && (query = query + ("a.email='" + args.email + "',"));
            !!args.gender && (query = query + ("a.gender='" + args.gender + "',"));
            !!args.age && (query = query + ("a.age=" + args.age + ","));
            !!args.description && (query = query + ("a.description='" + args.description + "',"));
            !!args.school && (query = query + ("a.school='" + args.school + "',"));
            !!args.work && (query = query + ("a.work='" + args.work + "',"));
            !!args.token && (query = query + ("a.token='" + args.token + "',"));
            isBoolean(args.sendNotifications) && (query = query + ("a.sendNotifications=" + args.sendNotifications + ","));
            !!args.distance && (query = query + ("a.distance=" + args.distance + ","));
            !!args.latitude && (query = query + ("a.latitude=" + args.latitude + ","));
            !!args.longitude && (query = query + ("a.longitude=" + args.longitude + ","));
            !!args.minAgePreference && (query = query + ("a.minAgePreference=" + args.minAgePreference + ","));
            !!args.maxAgePreference && (query = query + ("a.maxAgePreference=" + args.maxAgePreference + ","));
            !!args.pics && (query = query + ("a.pics=[" + args.pics.map(function (pic) { return "\"" + pic + "\""; }) + "],"));
            console.log('query slice: ', query.slice(0, -1));
            query = query.slice(-1) === ',' ? query.slice(0, -1) : query;
            query = query + " RETURN a";
            console.log('query: ', query);
            return session
                .run(query)
                .then(function (result) {
                console.log('result: ', result);
                return result.records;
            })
                .then(function (records) { return records[0]._fields[0].properties; })
                .catch(function (e) { return console.log('editUser error: ', e); });
        },
        likeUser: function (_, args) { return __awaiter(_this, void 0, void 0, function () {
            var mutate, query, result, user, resultMatch, matchId, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mutate = "MATCH (a:User {id:'" + args.id + "'}), (b:User {id:'" + args.likedId + "'}) MERGE (a)-[r:LIKES]->(b) return b";
                        query = "MATCH (a:User {id:'" + args.id + "'})<-[r:LIKES]-(b:User {id:'" + args.likedId + "'}) return b";
                        return [4 /*yield*/, session.run(mutate)];
                    case 1:
                        result = _a.sent();
                        user = result.records[0]._fields[0].properties;
                        return [4 /*yield*/, session.run(query)];
                    case 2:
                        resultMatch = _a.sent();
                        if (!(resultMatch.records.length > 0)) return [3 /*break*/, 9];
                        matchId = uuid.v1();
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 7, , 8]);
                        return [4 /*yield*/, session.run("MATCH (a:User {id:'" + args.id + "'})<-[r:LIKES]-(b:User {id:'" + args.likedId + "'}) SET r.matchId='" + matchId + "'")];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, session.run("MATCH (a:User {id:'" + args.id + "'})-[r:LIKES]->(b:User {id:'" + args.likedId + "'}) SET r.matchId='" + matchId + "'")];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, firestore_1.db.collection("matches").doc("" + matchId).set({
                                user1: args.id,
                                user2: args.likedId,
                                matchTime: new Date()
                            })];
                    case 6:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        e_2 = _a.sent();
                        console.log('likeUser error creating match: ', e_2);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/, { id: args.likedId, name: user.name, match: true }];
                    case 9: return [2 /*return*/, { id: args.likedId, name: user.name, match: false }];
                }
            });
        }); },
        newUser: function (_, args) {
            console.log('args: ', args);
            var query = "CREATE(a:User{\n                id: '" + args.id + "',\n                name: '" + args.name + "',\n                active: " + args.active + ",\n                email: '" + args.email + "',\n                gender: '" + args.gender + "',";
            !!args.age && (query = query + ("age:" + args.age + ","));
            !!args.description && (query = query + ("description:'" + args.description + "',"));
            !!args.school && (query = query + ("school:'" + args.school + "',"));
            !!args.work && (query = query + ("work:'" + args.work + "',"));
            !!args.token && (query = query + ("token:'" + args.token + "',"));
            !!args.sendNotifications && (query = query + ("sendNotifications:" + args.sendNotifications + ","));
            !!args.distance && (query = query + ("distance:" + args.distance + ","));
            !!args.latitude && (query = query + ("latitude:" + args.latitude + ","));
            !!args.longitude && (query = query + ("longitude:" + args.longitude + ","));
            !!args.minAgePreference && (query = query + ("minAgePreference:" + args.minAgePreference + ","));
            !!args.maxAgePreference && (query = query + ("maxAgePreference:" + args.maxAgePreference + ","));
            !!args.pics && (query = query + ("pics:[" + args.pics.map(function (pic) { return "\"" + pic + "\""; }) + "],"));
            query = query.slice(-1) === ',' ? query.slice(0, -1) : query;
            query = query + "}) RETURN a";
            console.log('query: ', query);
            return session
                .run(query)
                .then(function (result) {
                console.log('result: ', result);
                return result.records;
            })
                .then(function (records) { return records[0]._fields[0].properties; })
                .catch(function (e) { return console.log('newUser error: ', e); });
        },
        newMessage: function (_, args) {
            console.log('args: ', args);
            var message = {
                id: args.id,
                name: args.name,
                message: args.message,
                //date: moment().format('MMMM Do YYYY, h:mm:ss a')
                date: new Date()
            };
            return firestore_1.db.collection("matches/" + args.matchId + "/messages").add(message)
                .then(function () {
                console.log(args.name + " posted message to matchId " + args.matchId);
                return message;
            })
                .catch(function (e) { return console.error("error writing new message to " + args.matchId + ": " + e); });
        }
    }
};
exports.default = resolvers;
