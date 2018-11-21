import { QueryResolvers } from "../../types/generated";
import { db } from "../../db/firestore";
import { driver } from "../../db/neo4j";
import { MESSAGE_PAGE_LENGTH, QUEUE_PAGE_LENGTH } from "./variables";

const session = driver.session();

export const Query: QueryResolvers.Type = {
  ...QueryResolvers.defaultResolvers,
  user: async (_, { id, hostId }, { dataSources }) => {
    console.log("hostId: ", hostId);
    console.log("id: ", id);
    // console.log("user args: ", args);
    return await dataSources.neoAPI.findUser({ id, hostId });
    // if (args.id) {
    //   console.log("args: ", args);
    //   return session
    //     .run(`Match (n:User {id: '${args.id}'}) RETURN n`)
    //     .then((result: any) => result.records)
    //     .then((records: any) => {
    //       console.log("records: ", records);
    //       if (!records.length) {
    //         return null;
    //       }
    //       const properties = records[0]._fields[0].properties;
    //       return {
    //         ...properties,
    //         profilePic: !!properties.pics ? properties.pics[0] : null,
    //         hostId: !!args.hostId ? args.hostId : null
    //       };
    //     })
    //     .catch((e: string) => console.log("id lookup error: ", e));
    // } else {
    //   console.log("Error, no id inputted!");
    //   return null;
    // }
    // } else {
    //   console.log("args: ", args);
    //   return session
    //     .run(`Match (n:User {token: '${args.token}'}) RETURN n`)
    //     .then((result: any) => result.records)
    //     .then((records: any) => {
    //       console.log("records: ", records);
    //       if (!records.length) {
    //         return null;
    //       }
    //       const properties = records[0]._fields[0].properties;
    //       return {
    //         ...properties,
    //         profilePic: !!properties.pics ? properties.pics[0] : null,
    //         hostId: !!args.hostId ? args.hostId : null
    //       };
    //     })
    //     .catch((e: string) => console.log("token lookup error: ", e));
    // }
  },
  messages: async (_, args) => {
    console.log("in moreMessages");
    console.log("args: ", args);

    const query: any = db
      .collection(`matches/${args.id}/messages`)
      .orderBy("order")
      .limit(MESSAGE_PAGE_LENGTH);

    let data!: any;
    try {
      data = await query.get();
    } catch (e) {
      console.log("error fetching more messages from firestore: ", e);
      return {
        id: args.id,
        list: [],
        cursor: null
      };
    }

    const messages = data.docs.map((doc: any) => {
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

    // If there are no additional messages left, return an empty message array and
    // don't change the cursor
    if (messages.length === 0) {
      return {
        id: args.id,
        list: [],
        cursor: null
      };
    }

    // Set the new cursor to the last date in the message array
    // Return a null cursor if the message array length is less than 20, indicating that their
    // are no more messages left to retreive.
    const cursor: number | null =
      messages.length >= MESSAGE_PAGE_LENGTH
        ? messages[messages.length - 1].order
        : null;

    console.log("messages in moreMessages: ", messages);
    console.log("newCursor: ", cursor);

    return {
      id: args.id,
      list: messages,
      cursor
    };
  },
  date: (_, args) => {
    return session
      .run(
        `MATCH(d:Date{id:'${args.id}'}) 
              RETURN d`
      )
      .then((result: any) => result.records[0])
      .then((record: any) => record._fields[0].properties)
      .catch((e: string) => {
        console.log("date error: ", e);
        return null;
      });
  },
  dates: (_, __) => {
    throw new Error("Resolver not implemented");
  },
  otherBids: (_, args) => {
    // dateID should be passed in as the id
    // Need to factor in pagination
    // Should sort by date?
    console.log("otherBids args: ", args);
    return session
      .run(
        `MATCH(b:User)-[r:BID]->(d:Date{id:'${args.id}'}) 
          WITH b,r,d, r.datetimeOfBid as order
          RETURN b,r
          ORDER BY order DESC
        `
      )
      .then((result: any) => result.records)
      .then((records: Array<any>) => {
        const list = records.map((record: any) => ({
          id: record._fields[0].properties.id,
          datetimeOfBid: record._fields[1].properties.datetimeOfBid,
          bidDescription: record._fields[1].properties.bidDescription,
          bidPlace: record._fields[1].properties.bidPlace,
          bidUser: {
            ...record._fields[0].properties,
            profilePic: !!record._fields[0].properties.pics
              ? record._fields[0].properties.pics[0]
              : null
          }
        }));
        return {
          id: `${args.id}b`,
          list,
          cursor: null
        };
      })
      .catch((e: string) => console.log("bid error: ", e));
  },
  moreMessages: async (_, args) => {
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
    const query = db
      .collection(`matches/${args.id}/messages`)
      .orderBy("order")
      .startAfter(cursor)
      .limit(MESSAGE_PAGE_LENGTH);

    let data;
    try {
      data = await query.get();
    } catch (e) {
      console.log("error fetching more messages from firestore: ", e);
      return {
        id: args.id,
        list: [],
        cursor
      };
    }

    const messages = data.docs.map((doc: any) => {
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

    // If there are no additional messages left, return an empty message array and
    // don't change the cursor
    if (messages.length === 0) {
      return {
        id: args.id,
        list: [],
        cursor
      };
    }

    // Set the new cursor to the last date in the message array
    // Return a null cursor if the message array length is less than 20, indicating that their
    // are no more messages left to retreive.
    const newCursor: number | null =
      messages.length >= MESSAGE_PAGE_LENGTH
        ? messages[messages.length - 1].order
        : null;

    console.log("messages in moreMessages: ", messages);
    console.log("newCursor: ", newCursor);

    return {
      id: args.id,
      list: messages,
      cursor: newCursor
    };
  },
  moreQueue: async (_, args) => {
    console.log("in Queue");
    console.log("args: ", args);

    const { id } = args;
    let followQuery!: string;

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

    let viewObjectionable!: string;

    try {
      const viewObjectionableRaw: any = await session.run(
        `MATCH(a:User{id:'${id}}) return a.viewObjectionable`
      );
      const viewObjectionableResult: boolean =
        viewObjectionableRaw.records[0].fields[0];

      if (viewObjectionableResult) {
        viewObjectionable = `AND viewObjectionable`;
      } else {
        viewObjectionable = `AND NOT viewObjectionable`;
      }
    } catch (e) {
      console.log(
        "Not able to objection viewObjectionable preference. Defaulting to view non-objectionable content"
      );
      viewObjectionable = `AND NOT viewObjectionable`;
    }

    if (!args.cursor) {
      console.log(
        "No cursor passed in. You must be at the end of the list. No more values to retreive."
      );
      return {
        list: [],
        cursor: null,
        id: `${id}q`
      };
    } else if (!id) {
      console.error("Error! No id passed in!");
    }

    return session
      .run(
        `MATCH(a:User{id:'${id}'}),(b:User) 
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
              LIMIT ${QUEUE_PAGE_LENGTH}`
      )
      .then((result: any) => result.records)
      .then((records: Array<any>) => {
        const list = records.map((record: any) => {
          return {
            ...record._fields[0].properties,
            distanceApart: record._fields[1],
            order: record._fields[3],
            profilePic: !!record._fields[0].properties.pics
              ? record._fields[0].properties.pics[0]
              : null,
            isFollowing: record._fields[4],
            hasDateOpen: record._fields[5]
          };
        });
        if (list.length === 0) {
          // If the list is empty, return a blank list and a null cursor
          return {
            list: [],
            cursor: null,
            id: `${id}q`
          };
        }

        const newCursor: number | null | undefined =
          list.length >= QUEUE_PAGE_LENGTH ? list[list.length - 1].order : null;

        return {
          list,
          cursor: newCursor,
          id: `${id}q`
        };
      })
      .catch((e: string) => console.log("moreQueue error: ", e));
  },
  moreDates: (_, __) => {
    throw new Error("Resolver not implemented");
  },
  moreDateBids: (_, __) => {
    throw new Error("Resolver not implemented");
  },
  moreFollowing: (_, __) => {
    throw new Error("Resolver not implemented");
  }
};
