const uuid = require("node-uuid");
import { MutationResolvers } from "../../types/generated";
import { newUserDefaults } from "../defaults";
import { driver } from "../../db/neo4j";
import { db } from "../../db/firestore";
import { getQueue } from "../../middleware/queue";
import {
  getCurrentDateFirestore,
  getCurrentDateNeo
} from "../../middleware/format";
import { pubsub } from "../../pubsub/index";
import { NEW_MESSAGE } from "../../pubsub/subscriptions";
import { newMessagePush } from "../../middleware/newMessagePush";
import { createDatePush } from "../../middleware/createDatePush";
import {
  chooseWinnerPushWinner,
  chooseWinnerPushLoser
} from "../../middleware/chooseWinnerPush";

const session = driver.session();

export const Mutation: MutationResolvers.Type = {
  ...MutationResolvers.defaultResolvers,
  editUser: (_, args) => {
    const isBoolean = (val: any) => "boolean" === typeof val;
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
      .then((result: any) => {
        console.log("result: ", result);
        return result.records;
      })
      .then((records: any) => records[0]._fields[0].properties)
      .catch((e: string) => console.log("editUser error: ", e));
  },
  editUserQueue: async (_, args) => {
    const isBoolean = (val: any) => "boolean" === typeof val;
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
      await session.run(query);
    } catch (e) {
      console.log("editUserQueue error: ", e);
      return null;
    }
    let result;
    try {
      result = await getQueue({ id: args.id, followerDisplay: null });
    } catch (e) {
      console.log("editUserQueue error: ", e);
      return null;
    }
    return result;
  },
  newUser: async (_, tempArgs) => {
    console.log("tempArgs: ", tempArgs);
    const args = { ...newUserDefaults, ...tempArgs };

    let idAlreadyExist;
    try {
      idAlreadyExist = await session.run(
        `MATCH (a:User{id: '${args.id}'}) return a.id`
      );
    } catch (e) {
      console.log("Error checking if user already exists");
      return { id: null };
    }
    if (idAlreadyExist.records.length) {
      console.log("Email already registered");
      return { id: false };
    }

    const isBoolean = (val: any) => "boolean" === typeof val;

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
      .then((result: any) => {
        console.log("result: ", result);
        return result.records;
      })
      .then((records: any) => records[0]._fields[0].properties)
      .catch((e: string) => console.log("newUser error: ", e));
  },
  newMessage: async (_, args) => {
    // console.log('in newMessage resolver');
    // console.log('args: ',args);
    const message = {
      _id: args._id,
      name: args.name,
      text: args.text,
      avatar: args.avatar,
      createdAt: getCurrentDateFirestore(),
      order: args.order,
      uid: args.uid
      //createdAt: moment().format('MMMM Do YYYY, h:mm:ss a')
    };

    // console.log('message: ',message);

    try {
      await db.collection(`matches/${args.matchId}/messages`).add(message);
    } catch (e) {
      console.error(`error writing new message to ${args.matchId}: ${e}`);
      return null;
    }

    // Call our subscription asynchronously so we don't slow down our client.
    const asyncFunc = async () => {
      console.log("in pubsub async");
      // console.log('args.matchId: ',args.matchId);
      // console.log('message: ',message);
      // console.log('sub tag: ',NEW_MESSAGE);
      pubsub.publish(NEW_MESSAGE, {
        newMessageSub: { message, matchId: args.matchId }
      });
      newMessagePush({
        matchId: args.matchId,
        otherId: args.uid,
        otherName: args.name,
        otherPic: args.avatar,
        text: args.text,
        id: args.receiverId
      });
    };
    asyncFunc();

    console.log(`${args.name} posted message to matchId ${args.matchId}`);

    return message;
  },
  follow: (_, args) => {
    // supports both follow and unfollow
    let query;
    const { isFollowing, id, followId } = args;

    console.log("follow start");
    console.log("args: ", args);
    console.log("isFollowing: ", isFollowing);
    console.log("followId: ", followId);
    console.log("id: ", id);

    if (isFollowing) {
      query = `MATCH (a:User {id:'${id}'}), (b:User {id:'${followId}'}) MERGE (a)-[r:FOLLOWING]->(b) RETURN b`;
    } else {
      query = `MATCH (a:User {id:'${id}'})-[r:FOLLOWING]->(b:User {id:'${followId}'}) DELETE r RETURN b`;
    }

    console.log("query: ", query);

    return session
      .run(query)
      .then((result: any) => {
        console.log("result: ", result);
        return result.records[0];
      })
      .then((record: any) => ({ ...record._fields[0].properties, isFollowing }))
      .catch((e: string) => console.log("follow mutation error: ", e));
  },
  unFollow: (_, args) => {
    const query = `MATCH (a:User {id:'${
      args.id
    }'})-[r:FOLLOWING]->(b:User {id:'${args.unFollowId}'}) DELETE r RETURN b`;

    return session
      .run(query)
      .then((result: any) => {
        return result.records[0];
      })
      .then((record: any) => ({
        ...record._fields[0].properties,
        isFollowing: false
      }))
      .catch((e: string) => console.log("follow mutation error: ", e));
  },
  bid: (_, args) => {
    // Need to make sure client cannot input doublequote ("). It will break the query.
    const datetimeOfBid = getCurrentDateNeo();
    const bidId = uuid();

    let query = `MATCH (a:User {id:'${args.id}'}), (d:Date {id:'${
      args.dateId
    }'}) 
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
      .then((result: any) => {
        return result.records[0];
      })
      .then((record: any) => ({
        ...record._fields[0].properties
      }))
      .catch((e: string) => console.log("bid mutation error: ", e));
  },
  createDate: async (_, args) => {
    // Currently, I am only creating the node field, but I also need to create the :CREATE relationship

    const creationTime = getCurrentDateNeo();
    const dateId = uuid();

    let query = `CREATE (d:Date {id:'${dateId}',creator:'${
      args.id
    }',creationTime:'${creationTime}',open:TRUE,`;
    !!args.datetimeOfDate &&
      (query = query + `datetimeOfDate:"${args.datetimeOfDate}",`) +
        !!args.description &&
      (query = query + `description:"${args.description}",`);

    query = query.slice(-1) === "," ? query.slice(0, -1) : query;
    query = query + `}) RETURN d`;

    console.log("query in createDate: ", query);

    let rawDate;
    let date;

    // In order to create a new date, we need to create a date node and a :CREATE relationship between
    // the date creator and the new date node.
    try {
      rawDate = await session.run(query);
      date = rawDate.records[0]._fields[0].properties;
    } catch (e) {
      console.log("createDate mutation error d node: ", e);
      return null;
    }
    try {
      await session.run(
        `MATCH (a:User {id:'${
          args.id
        }'}), (d:Date {id:'${dateId}'}) MERGE (a)-[r:CREATE]->(d)`
      );
    } catch (e) {
      console.log("createDate mutation error relationship create: ", e);
      return null;
    }
    // Push Notification for new date
    // -------------------------------
    // For each user following the creator, send out a push notification
    createDatePush(args.id, date);

    return date;
  },
  chooseWinner: async (_, args) => {
    // In order to create a winner, we need to set winner=true on the bid, set open to FALSE on the date
    // Then we need to create a new document in the Firestore database, which will store messages between the
    // two.
    console.log("choosewinner args: ", args);
    const { id, winnerId, dateId } = args;

    let date;

    // Update neo4j values
    try {
      const data = await session.run(`MATCH (a:User{id:'${id}'})-[:CREATE]->(d:Date{id:'${dateId}'})<-[r:BID]-(b:User{id:'${winnerId}'}) 
                  WITH d,a,b,r
                  SET r.winner=TRUE,
                  d.winner='${winnerId}',
                  d.open=FALSE
                  return d,a,b`);
      console.log("data: ", data);
      date = {
        ...data.records[0]._fields[0].properties,
        creator: data.records[0]._fields[1].properties,
        winner: data.records[0]._fields[2].properties
        //num_bids: data.records[0]._fields[3],
      };
    } catch (e) {
      console.error("Error updating winner value on choosewinner: ", e);
      return null;
    }

    // Create new document in Firestore for match
    try {
      await db
        .collection(`matches`)
        .doc(dateId)
        .set({
          user1: id,
          user2: winnerId,
          matchTime: getCurrentDateFirestore(),
          datetimeOfDate: date.datetimeOfDate,
          description: date.description
        });
    } catch (e) {
      console.error(`chooseWinner error updating Firestore: ${e}`);
      return null;
    }

    chooseWinnerPushWinner(date);
    chooseWinnerPushLoser(date);
    console.log("chooseWinner date: ", date);
    return date;
  },
  flag: (_, args) => {
    const { id, flaggedId, block } = args;

    if (block) {
      session
        .run(
          `MATCH (a:User{id:'${id}'}), (b:User{id:'${flaggedId}'}) 
            CREATE (a)-[r:BLOCK { active: true }]->(b)
            return a`
        )
        .then((result: any) => {
          return result.records[0];
        })
        .then((record: any) => ({ ...record._fields[0].properties }))
        .then((b: string) => console.log("Blocked user: ", b))
        .catch((e: string) => console.log("Error blocking user: ", e));
    }

    return session
      .run(
        `MATCH (a:User{id:'${flaggedId}'}) set a.objectionable = true RETURN a`
      )
      .then((result: any) => {
        return result.records[0];
      })
      .then((record: any) => ({ ...record._fields[0].properties }))
      .catch((e: string) =>
        console.log("Error flagging user for objectionable content: ", e)
      );
  },
  block: (_, args) => {
    console.log("args: ", args);
    const { id, blockedId } = args;
    return session
      .run(
        `MATCH (a:User{id:'${id}'}), (b:User{id:'${blockedId}'}) 
          CREATE (a)-[r:BLOCK { active: true }]->(b)
          return b`
      )
      .then((result: any) => {
        return result.records[0];
      })
      .then((record: any) => ({ ...record._fields[0].properties }))
      .catch((e: string) => console.log("Error blocking user: ", e));
  }
};
