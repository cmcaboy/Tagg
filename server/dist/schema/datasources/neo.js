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
const variables_1 = require("../resolvers/variables");
const queue_1 = require("../../middleware/queue");
const defaults_1 = require("../defaults");
const { DataSource } = require("apollo-datasource");
class NeoAPI extends DataSource {
    constructor({ session }) {
        super();
        this.findDate = ({ id }) => {
            return this.session
                .run(`MATCH(d:Date{id:'${id}'}) 
            RETURN d`)
                .then((result) => result.records[0])
                .then((record) => record._fields[0].properties)
                .catch((e) => {
                console.log("date error: ", e);
                return null;
            });
        };
        this.findOtherBids = ({ id }) => {
            return this.session
                .run(`MATCH(b:User)-[r:BID]->(d:Date{id:'${id}'}) 
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
                    id: `${id}b`,
                    list,
                    cursor: null
                };
            })
                .catch((e) => console.log("bid error: ", e));
        };
        this.getQueueMore = ({ cursor, followerDisplay }) => __awaiter(this, void 0, void 0, function* () {
            const id = this.context.user.id;
            let followQuery;
            switch (followerDisplay) {
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
                const viewObjectionableRaw = yield this.session.run(`MATCH(a:User{id:'${id}}) return a.viewObjectionable`);
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
            if (!cursor) {
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
            return this.session
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
              order > ${cursor}
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
        });
        this.getDateCreator = ({ id }) => {
            return this.session
                .run(`MATCH(a:User)-[:CREATE]->(d:Date)<-[r:BID{id:'${id}'}]-(b:User)
                RETURN a`)
                .then((result) => result.records[0])
                .then((record) => record._fields[0].properties)
                .catch((e) => console.log("winner error: ", e));
        };
        this.findDateBidder = ({ id }) => {
            return this.session
                .run(`MATCH(a:User)-[:CREATE]->(d:Date)<-[r:BID{id:'${id}'}]-(b:User)
                  RETURN b`)
                .then((result) => result.records[0])
                .then((record) => record._fields[0].properties)
                .catch((e) => console.log("winner error: ", e));
        };
        this.findDateFromBid = ({ id }) => {
            return this.session
                .run(`MATCH(a:User)-[:CREATE]->(d:Date)<-[r:BID{id:'${id}'}]-(b:User)
                RETURN d`)
                .then((result) => result.records[0])
                .then((record) => record._fields[0].properties)
                .catch((e) => console.log("winner error: ", e));
        };
        this.findCreatorFromDate = ({ id }) => {
            return this.session
                .run(`MATCH(a:User)-[:CREATE]->(d:Date{id:'${id}'})
                  RETURN a`)
                .then((result) => result.records[0])
                .then((record) => record._fields[0].properties)
                .catch((e) => console.log("creator error: ", e));
        };
        this.findNumberOfBidsFromDate = ({ id }) => {
            return this.session
                .run(`MATCH(d:Date{id:'${id}'})
                  WITH size((d)<-[:BID]-(:User)) as num_bids
                  return num_bids`)
                .then((result) => result.records[0])
                .then((record) => record._fields[0])
                .catch((e) => console.log("num_bids error: ", e));
        };
        this.findDateWinner = ({ id }) => {
            return this.session
                .run(`MATCH(d:Date{id:'${id}'})<-[r:BID{winner:TRUE}]-(b:User)
                  RETURN b`)
                .then((result) => result.records[0])
                .then((record) => record._fields[0].properties)
                .catch((e) => console.log("winner error: ", e));
        };
        this.findBidsFromDate = ({ id }) => {
            return this.session
                .run(`MATCH(b:User)-[r:BID]->(d:Date{id:'${id}'}) RETURN r`)
                .then((result) => result.records)
                .then((records) => {
                const list = records.map(record => (Object.assign({}, record._fields[0].properties)));
                return {
                    id: `${id}b`,
                    list,
                    cursor: null
                };
            })
                .catch((e) => console.log("bid error: ", e));
        };
        this.userHasDateOpen = ({ id }) => {
            return this.session
                .run(`MATCH(a:User{id:'${id}'}) 
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
        };
        this.userDistanceApart = ({ id, distanceApart }) => {
            const hostId = this.context.user.id;
            if (!hostId)
                return distanceApart;
            return this.session
                .run(`MATCH(a:User{id:'${hostId}'}),(b:User{id:'${id}'})
              WITH  distance(point(a),point(b))*0.000621371 as distanceApart
              RETURN distanceApart`)
                .then((result) => result.records[0])
                .then((record) => record._fields[0])
                .catch((e) => console.log("distanceApart error: ", e));
        };
        this.userIsFollowing = ({ id, isFollowing }) => {
            const hostId = this.context.user.id;
            if (!hostId)
                return isFollowing;
            return this.session
                .run(`MATCH(a:User{id:'${hostId}'}),(b:User{id:'${id}'})
              WITH exists((a)-[:FOLLOWING]->(b)) as isFollowing
              RETURN isFollowing`)
                .then((result) => result.records[0])
                .then((record) => record._fields[0])
                .catch((e) => console.log("isFollowing error: ", e));
        };
        this.getFollowersFromUser = () => {
            const id = this.context.user.id;
            return this.session
                .run(`MATCH(a:User{id:'${id}'})-[r:FOLLOWING]->(b:User) 
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
                    id: `${id}f`,
                    list,
                    cursor: null
                };
            })
                .catch((e) => console.log("following error: ", e));
        };
        this.findBidsFromUser = ({ id }) => {
            return this.session
                .run(`MATCH(a:User{id:'${id}'})-[r:BID]->(d:Date)<-[:CREATE]-(b:User) RETURN b,d,r`)
                .then((result) => result.records)
                .then((records) => {
                console.log("bids records: ", records);
                const list = records.map(record => (Object.assign({}, record._fields[2].properties, { id: record._fields[1].properties.id, user: record._fields[0].properties })));
                console.log("bids list: ", list);
                return {
                    id: `${id}b`,
                    list,
                    cursor: null
                };
            })
                .catch((e) => console.log("bid error: ", e));
        };
        this.findDateRequests = () => {
            const id = this.context.user.id;
            return this.session
                .run(`MATCH(a:User{id:'${id}'})-[:CREATE]->(d:Date) 
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
                    id: `${id}d`,
                    list,
                    cursor: null
                };
            })
                .catch((e) => console.log("dateRequest error: ", e));
        };
        this.getUserQueue = ({ followerDisplay }) => {
            const id = this.context.user.id;
            queue_1.getQueue({ id, followerDisplay });
        };
        this.getMatchedDates = () => {
            const id = this.context.user.id;
            const query = `MATCH(a:User{id:'${id}'}),(b:User),(d:Date)
              WHERE (
                (a)-[:CREATE]->(d)<-[:BID{winner:TRUE}]-(b) OR
                (a)-[:BID{winner:TRUE}]->(d)<-[:CREATE]-(b)
              ) AND
                NOT (a)-[:BLOCK]->(b)
              RETURN b, d.id, d.description, d.datetimeOfDate
              ORDER BY d.datetimeOfDate`;
            console.log("query: ", query);
            return this.session
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
                        id: `${id}m`,
                        list: [],
                        cursor: null
                    };
                }
                const newCursor = null;
                console.log("matchedDates list: ", list);
                return {
                    id: `${id}m`,
                    list,
                    cursor: newCursor
                };
            })
                .catch((e) => console.log("matches error: ", e));
        };
        this.setUser = (args) => {
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
                (query = query + `a.pics=[${args.pics.map((pic) => `"${pic}"`)}],`);
            query = query.slice(-1) === "," ? query.slice(0, -1) : query;
            query = query + ` RETURN a`;
            return this.session
                .run(query)
                .then((result) => {
                console.log("result: ", result);
                return result.records;
            })
                .then((records) => records[0]._fields[0].properties)
                .catch((e) => console.log("editUser error: ", e));
        };
        this.setUserQueue = (args) => __awaiter(this, void 0, void 0, function* () {
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
                return yield this.session.run(query);
            }
            catch (e) {
                console.log("editUserQueue error: ", e);
                return null;
            }
            ;
        });
        this.createUser = (tempArgs) => __awaiter(this, void 0, void 0, function* () {
            const args = Object.assign({}, defaults_1.newUserDefaults, tempArgs);
            let idAlreadyExist;
            try {
                idAlreadyExist = yield this.session.run(`MATCH (a:User{id: '${args.id}'}) return a.id`);
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
                (query = query + `pics:[${args.pics.map((pic) => `"${pic}"`)}],`);
            query = query.slice(-1) === "," ? query.slice(0, -1) : query;
            query = query + `}) RETURN a`;
            console.log("query: ", query);
            return this.session
                .run(query)
                .then((result) => {
                console.log("result: ", result);
                return result.records;
            })
                .then((records) => records[0]._fields[0].properties)
                .catch((e) => console.log("newUser error: ", e));
        });
        this.followUser = ({ followId, isFollowing }) => {
            const id = this.context.user.id;
            let query;
            if (isFollowing) {
                query = `MATCH (a:User {id:'${id}'}), (b:User {id:'${followId}'}) MERGE (a)-[r:FOLLOWING]->(b) RETURN b`;
            }
            else {
                query = `MATCH (a:User {id:'${id}'})-[r:FOLLOWING]->(b:User {id:'${followId}'}) DELETE r RETURN b`;
            }
            ;
            console.log("query: ", query);
            return this.session
                .run(query)
                .then((result) => {
                console.log("result: ", result);
                return result.records[0];
            })
                .then((record) => (Object.assign({}, record._fields[0].properties, { isFollowing })))
                .catch((e) => console.log("follow mutation error: ", e));
        };
        this.unFollowUser = ({ unFollowId }) => {
            const id = this.context.user.id;
            const query = `MATCH (a:User {id:'${id}'})-[r:FOLLOWING]->(b:User {id:'${unFollowId}'}) DELETE r RETURN b`;
            return this.session
                .run(query)
                .then((result) => {
                return result.records[0];
            })
                .then((record) => (Object.assign({}, record._fields[0].properties, { isFollowing: false })))
                .catch((e) => console.log("follow mutation error: ", e));
        };
        this.createBid = ({ dateId, bidId, bidPlace, bidDescription, datetimeOfBid }) => __awaiter(this, void 0, void 0, function* () {
            const id = this.context.user.id;
            let query = `MATCH (a:User {id:'${id}'}), (d:Date {id:'${dateId}'}) 
              MERGE (a)-[r:BID{id: '${bidId}',datetimeOfBid: '${datetimeOfBid}',`;
            !!bidPlace &&
                (query = query + `bidPlace:"${bidPlace}",`) +
                    !!bidDescription &&
                (query = query + `bidDescription:"${bidDescription}",`);
            query = query.slice(-1) === "," ? query.slice(0, -1) : query;
            query = query + `}]->(d) RETURN r`;
            console.log("query in bid: ", query);
            return this.session
                .run(query)
                .then((result) => {
                return result.records[0];
            })
                .then((record) => (Object.assign({}, record._fields[0].properties)))
                .catch((e) => console.log("bid mutation error: ", e));
        });
        this.createDate = ({ dateId, creationTime, datetimeOfDate, description }) => __awaiter(this, void 0, void 0, function* () {
            const id = this.context.user.id;
            let query = `CREATE (d:Date {id:'${dateId}',creator:'${id}',creationTime:'${creationTime}',open:TRUE,`;
            !!datetimeOfDate &&
                (query = query + `datetimeOfDate:"${datetimeOfDate}",`) +
                    !!description &&
                (query = query + `description:"${description}",`);
            query = query.slice(-1) === "," ? query.slice(0, -1) : query;
            query = query + `}) RETURN d`;
            console.log("query in createDate: ", query);
            let rawDate;
            let date;
            try {
                rawDate = yield this.session.run(query);
                date = rawDate.records[0]._fields[0].properties;
            }
            catch (e) {
                console.log("createDate mutation error d node: ", e);
                return null;
            }
            try {
                yield this.session.run(`MATCH (a:User {id:'${id}'}), (d:Date {id:'${dateId}'}) MERGE (a)-[r:CREATE]->(d)`);
            }
            catch (e) {
                console.log("createDate mutation error relationship create: ", e);
                return null;
            }
            return date;
        });
        this.createDateWinner = ({ winnerId, dateId }) => __awaiter(this, void 0, void 0, function* () {
            const id = this.context.user.id;
            let date;
            try {
                const data = yield this.session.run(`MATCH (a:User{id:'${id}'})-[:CREATE]->(d:Date{id:'${dateId}'})<-[r:BID]-(b:User{id:'${winnerId}'}) 
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
            return date;
        });
        this.setFlagUser = ({ flaggedId, block }) => {
            const id = this.context.user.id;
            if (block) {
                this.session
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
            return this.session
                .run(`MATCH (a:User{id:'${flaggedId}'}) set a.objectionable = true RETURN a`)
                .then((result) => {
                return result.records[0];
            })
                .then((record) => (Object.assign({}, record._fields[0].properties)))
                .catch((e) => console.log("Error flagging user for objectionable content: ", e));
        };
        this.setBlockUser = ({ blockedId }) => {
            const id = this.context.user.id;
            return this.session
                .run(`MATCH (a:User{id:'${id}'}), (b:User{id:'${blockedId}'}) 
          CREATE (a)-[r:BLOCK { active: true }]->(b)
          return b`)
                .then((result) => {
                return result.records[0];
            })
                .then((record) => (Object.assign({}, record._fields[0].properties)))
                .catch((e) => console.log("Error blocking user: ", e));
        };
        console.log("neoAPI constructor");
        this.session = session;
    }
    initialize(config) {
        this.context = config.context;
    }
    findUser({ id, hostId }) {
        if (id) {
            return this.session
                .run(`Match (n:User {id: '${id}'}) RETURN n`)
                .then((result) => result.records)
                .then((records) => {
                console.log("records: ", records);
                if (!records.length) {
                    return null;
                }
                const properties = records[0]._fields[0].properties;
                return Object.assign({}, properties, { profilePic: !!properties.pics ? properties.pics[0] : null, hostId: !!hostId ? hostId : null });
            })
                .catch((e) => console.log("id lookup error: ", e));
        }
        else {
            console.log("Error, no id inputted!");
            return null;
        }
    }
}
exports.default = NeoAPI;
//# sourceMappingURL=neo.js.map