import { QUEUE_PAGE_LENGTH } from "../resolvers/variables";
import { getQueue } from "../../middleware/queue";
import { newUserDefaults } from '../defaults';
import { DateItem } from '../../types/DateItem';

const { DataSource } = require("apollo-datasource");

export default class neoAPI extends ( DataSource as { new(): any; } ) {
  constructor({ session }: { session: any }) {
    super();
    console.log("neoAPI constructor");

    this.session = session;
  }

  initialize(config: any) {
    this.context = config.context;
  }

  findUser({ id, hostId }: { id: string; hostId: string }) {
    if (id) {
      return this.session
        .run(`Match (n:User {id: '${id}'}) RETURN n`)
        .then((result: any) => result.records)
        .then((records: any) => {
          console.log("records: ", records);
          if (!records.length) {
            return null;
          }
          const properties = records[0]._fields[0].properties;
          return {
            ...properties,
            profilePic: !!properties.pics ? properties.pics[0] : null,
            hostId: !!hostId ? hostId : null
          };
        })
        .catch((e: string) => console.log("id lookup error: ", e));
    } else {
      console.log("Error, no id inputted!");
      return null;
    }
  }

  findDate = ({ id }: { id: string }) => {
    return this.session
      .run(
        `MATCH(d:Date{id:'${id}'}) 
            RETURN d`
      )
      .then((result: any) => result.records[0])
      .then((record: any) => record._fields[0].properties)
      .catch((e: string) => {
        console.log("date error: ", e);
        return null;
      });
  };

  findOtherBids = ({ id }: { id: string }) => {
    return this.session
      .run(
        `MATCH(b:User)-[r:BID]->(d:Date{id:'${id}'}) 
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
          id: `${id}b`,
          list,
          cursor: null
        };
      })
      .catch((e: string) => console.log("bid error: ", e));
  };

  getQueueMore = async ({ id, cursor, followerDisplay }: { id: string, cursor: number | null, followerDisplay: string }) => {

    let followQuery!: string;

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

    let viewObjectionable!: string;

    try {
      const viewObjectionableRaw: any = await this.session.run(
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

    if (!cursor) {
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

    return this.session
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
              order > ${cursor}
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
  };

  getDateCreator = ({ id }: { id: string }) => {
    return this.session
    .run(
      `MATCH(a:User)-[:CREATE]->(d:Date)<-[r:BID{id:'${
        id
      }'}]-(b:User)
                RETURN a`
    )
    .then((result: any) => result.records[0])
    .then((record: any) => record._fields[0].properties)
    .catch((e: string) => console.log("winner error: ", e));
  };

  findDateBidder = ({ id }: { id: string }) => {
    return this.session
      .run(
        `MATCH(a:User)-[:CREATE]->(d:Date)<-[r:BID{id:'${
          id
        }'}]-(b:User)
                  RETURN b`
      )
      .then((result: any) => result.records[0])
      .then((record: any) => record._fields[0].properties)
      .catch((e: string) => console.log("winner error: ", e));
  };

  findDateFromBid = ({ id }: { id: string }) => {
    return this.session
    .run(
      `MATCH(a:User)-[:CREATE]->(d:Date)<-[r:BID{id:'${
        id
      }'}]-(b:User)
                RETURN d`
    )
    .then((result: any) => result.records[0])
    .then((record: any) => record._fields[0].properties)
    .catch((e: string) => console.log("winner error: ", e));
  }

  findCreatorFromDate = ({ id }: { id: string }) => {
    return this.session
      .run(
        `MATCH(a:User)-[:CREATE]->(d:Date{id:'${id}'})
                  RETURN a`
      )
      .then((result: any) => result.records[0])
      .then((record: any) => record._fields[0].properties)
      .catch((e: string) => console.log("creator error: ", e));
  }

  findNumberOfBidsFromDate = ({ id }: { id: string }) => {
    return this.session
      .run(
        `MATCH(d:Date{id:'${id}'})
                  WITH size((d)<-[:BID]-(:User)) as num_bids
                  return num_bids`
      )
      .then((result: any) => result.records[0])
      .then((record: any) => record._fields[0])
      .catch((e: string) => console.log("num_bids error: ", e));
  };

  findDateWinner = ({ id }: { id: string }) => {
    return this.session
      .run(
        `MATCH(d:Date{id:'${id}'})<-[r:BID{winner:TRUE}]-(b:User)
                  RETURN b`
      )
      .then((result: any) => result.records[0])
      .then((record: any) => record._fields[0].properties)
      .catch((e: string) => console.log("winner error: ", e));
  }
  findBidsFromDate = ({ id }: { id: string }) => {
    return this.session
      .run(`MATCH(b:User)-[r:BID]->(d:Date{id:'${id}'}) RETURN r`)
      .then((result: any) => result.records)
      .then((records: any[]) => {
        const list = records.map(record => ({
          ...record._fields[0].properties
        }));
        return {
          id: `${id}b`,
          list,
          cursor: null
        };
      })
      .catch((e: any) => console.log("bid error: ", e));
  };

  userHasDateOpen = ({ id }: {id: string }) => {
    return this.session
      .run(
        `MATCH(a:User{id:'${id}'}) 
                      WITH a, 
                      exists((a)-[:CREATE]->(:Date{open:TRUE})) as hasDateOpen
                      RETURN hasDateOpen`
      )
      .then((result: any): any[] => result.records)
      .then(
        (records: any[]): boolean => {
          const hasDateOpen: boolean = records[0]._fields[0];
          console.log("hasDateOpen: ", hasDateOpen);
          return hasDateOpen;
        }
      )
      .catch((e: string) => console.log("hasDateOpen error: ", e));
  };
  userDistanceApart = ({ id, hostId, distanceApart }: {id: string, hostId: string | null, distanceApart: number | null }) => {
    // hostId is only used for UserProfile
    if (!hostId) return distanceApart;

    return this.session
      .run(
        `MATCH(a:User{id:'${hostId}'}),(b:User{id:'${
          id
        }'})
              WITH  distance(point(a),point(b))*0.000621371 as distanceApart
              RETURN distanceApart`
      )
      .then((result: any): any => result.records[0])
      .then((record: any): number => record._fields[0])
      .catch((e: string) => console.log("distanceApart error: ", e));
  };

  userIsFollowing = ({ id, hostId, isFollowing }: {id: string, hostId: string | null, isFollowing: number | null }) => {
    // Could pass in host user has an optional argument

    // hostId is only used for UserProfile
    if (!hostId) return isFollowing;

    return this.session
      .run(
        `MATCH(a:User{id:'${hostId}'}),(b:User{id:'${
          id
        }'})
              WITH exists((a)-[:FOLLOWING]->(b)) as isFollowing
              RETURN isFollowing`
      )
      .then((result: any): any => result.records[0])
      .then((record: any): boolean => record._fields[0])
      .catch((e: string) => console.log("isFollowing error: ", e));
  };

  getFollowersFromUser = ({ id }: {id: string }) => {
    // Need to factor in pagination
    return this.session
      .run(
        `MATCH(a:User{id:'${id}'})-[r:FOLLOWING]->(b:User) 
          WITH a,r,b, 
          exists((b)-[:CREATE]->(:Date{open:TRUE})) as hasDateOpen
          WHERE NOT (b)-[:BLOCK]->(a)
          RETURN b,hasDateOpen`
      )
      .then((result: any) => result.records)
      .then((records: any[]) => {
        console.log("following records: ", records);
        const list = records.map((record: any) => ({
          ...record._fields[0].properties,
          hasDateOpen: record._fields[1]
        }));
        console.log("following list: ", list);
        return {
          id: `${id}f`,
          list,
          cursor: null
        };
      })
      .catch((e: string) => console.log("following error: ", e));
  };

  findBidsFromUser = ({ id }: { id: string }) => {
    // Need to factor in pagination
    return this.session
      .run(
        `MATCH(a:User{id:'${
          id
        }'})-[r:BID]->(d:Date)<-[:CREATE]-(b:User) RETURN b,d,r`
      )
      .then((result: any): any[] => result.records)
      .then(
        (records: any[]): any => {
          console.log("bids records: ", records);
          const list = records.map(record => ({
            ...record._fields[2].properties,
            id: record._fields[1].properties.id,
            user: record._fields[0].properties
          }));
          console.log("bids list: ", list);
          return {
            id: `${id}b`,
            list,
            cursor: null
          };
        }
      )
      .catch((e: string) => console.log("bid error: ", e));
  };
  findDateRequests = ({ id }: { id: string }) => {
    return this.session
      .run(
        `MATCH(a:User{id:'${id}'})-[:CREATE]->(d:Date) 
          WITH a, d, size((d)<-[:BID]-(:User)) as num_bids, d.datetimeOfDate as order
          WHERE d.open=TRUE
          RETURN a,d,num_bids
          ORDER BY order DESC
        `
      )
      .then((result: any) => result.records)
      .then((records: any) => {
        console.log("dateRequests records: ", records);
        const list = records.map((record: any) => ({
          id: record._fields[1].properties.id,
          creator: record._fields[0].properties,
          creationTime: record._fields[1].properties.creationTime,
          datetimeOfDate: record._fields[1].properties.datetimeOfDate,
          description: record._fields[1].properties.description,
          num_bids: record._fields[2],
          open: record._fields[1].properties.open
        }));
        //console.log('dateRequests list: ',list);
        return {
          id: `${id}d`,
          list,
          cursor: null
        };
      })
      .catch((e: string) => console.log("dateRequest error: ", e));
  };
  getUserQueue = ({ id, followerDisplay }: { id: string, followerDisplay: string | null }) => getQueue({ id, followerDisplay });
  getMatchedDates = ({ id }: { id: string }) => {
    // A potential performance improvement would be to query Firestore directly
    // to get our list of matches
    // These matches should be sorted as well.

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
      .then((result: any) => {
        return result.records;
      })
      .then((records: any) => {
        const list = records.map((record: any) => {
          // console.log('record: ',record)
          // console.log('record field 1: ',record._fields[0])
          return {
            user: record._fields[0].properties,
            matchId: record._fields[1], // Call it dateId?
            id: record._fields[1],
            description: record._fields[2],
            datetimeOfDate: record._fields[3]
          };
        });
        if (list.length === 0) {
          // If the list is empty, return a blank list and a null cursor
          return {
            id: `${id}m`,
            list: [],
            cursor: null
          };
        }

        //const newCursor = list.length >= MATCH_PAGE_LENGTH ? list[list.length - 1].order : null;
        const newCursor = null;
        console.log("matchedDates list: ", list);

        return {
          id: `${id}m`,
          list,
          cursor: newCursor
        };
      })
      .catch((e: string) => console.log("matches error: ", e));
  };

  setUser = (args: any) => {
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
      (query = query + `a.pics=[${args.pics.map(( pic: string ) => `"${pic}"`)}],`);

    query = query.slice(-1) === "," ? query.slice(0, -1) : query;
    query = query + ` RETURN a`;

    return this.session
      .run(query)
      .then((result: any) => {
        console.log("result: ", result);
        return result.records;
      })
      .then((records: any) => records[0]._fields[0].properties)
      .catch((e: string) => console.log("editUser error: ", e));
  };

  setUserQueue = async (args: any) => {
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
      return await this.session.run(query);
    } catch (e) {
      console.log("editUserQueue error: ", e);
      return null;
    };  
  }

  createUser = async (tempArgs: any) => {
    const args = { ...newUserDefaults, ...tempArgs };

    let idAlreadyExist;
    try {
      idAlreadyExist = await this.session.run(
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
      (query = query + `pics:[${args.pics.map(( pic: any ) => `"${pic}"`)}],`);

    query = query.slice(-1) === "," ? query.slice(0, -1) : query;

    query = query + `}) RETURN a`;
    console.log("query: ", query);
    return this.session
      .run(query)
      .then((result: any) => {
        console.log("result: ", result);
        return result.records;
      })
      .then((records: any) => records[0]._fields[0].properties)
      .catch((e: string) => console.log("newUser error: ", e));
  };

  followUser = ({ id, followId, isFollowing }: { id: string, followId: string, isFollowing: boolean }) => {
    // supports both follow and unfollow
    let query;

    if (isFollowing) {
      query = `MATCH (a:User {id:'${id}'}), (b:User {id:'${followId}'}) MERGE (a)-[r:FOLLOWING]->(b) RETURN b`;
    } else {
      query = `MATCH (a:User {id:'${id}'})-[r:FOLLOWING]->(b:User {id:'${followId}'}) DELETE r RETURN b`;
    };

    console.log("query: ", query);

    return this.session
      .run(query)
      .then((result: any) => {
        console.log("result: ", result);
        return result.records[0];
      })
      .then((record: any) => ({ ...record._fields[0].properties, isFollowing }))
      .catch((e: string) => console.log("follow mutation error: ", e));
  };

  unFollowUser = ({ id, unFollowId }: { id: string, unFollowId: string }) => {
    const query = `MATCH (a:User {id:'${
      id
    }'})-[r:FOLLOWING]->(b:User {id:'${unFollowId}'}) DELETE r RETURN b`;

    return this.session
      .run(query)
      .then((result: any) => {
        return result.records[0];
      })
      .then((record: any) => ({
        ...record._fields[0].properties,
        isFollowing: false
      }))
      .catch((e: string) => console.log("follow mutation error: ", e));
  };

  createBid = async ({ id, dateId, bidId, bidPlace, bidDescription, datetimeOfBid }: {
    id: string;
    dateId: string;
    bidId: string;
    bidPlace: string;
    bidDescription: string;
    datetimeOfBid: string;
  }) => {
    let query = `MATCH (a:User {id:'${id}'}), (d:Date {id:'${
      dateId
    }'}) 
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
      .then((result: any) => {
        return result.records[0];
      })
      .then((record: any) => ({
        ...record._fields[0].properties
      }))
      .catch((e: string) => console.log("bid mutation error: ", e));
  };
  createDate = async ({ id, dateId, creationTime, datetimeOfDate, description }: DateItem) => {
    let query = `CREATE (d:Date {id:'${dateId}',creator:'${
      id
    }',creationTime:'${creationTime}',open:TRUE,`;
    !!datetimeOfDate &&
      (query = query + `datetimeOfDate:"${datetimeOfDate}",`) +
        !!description &&
      (query = query + `description:"${description}",`);

    query = query.slice(-1) === "," ? query.slice(0, -1) : query;
    query = query + `}) RETURN d`;

    console.log("query in createDate: ", query);

    let rawDate;
    let date;

    // In order to create a new date, we need to create a date node and a :CREATE relationship between
    // the date creator and the new date node.
    try {
      rawDate = await this.session.run(query);
      date = rawDate.records[0]._fields[0].properties;
    } catch (e) {
      console.log("createDate mutation error d node: ", e);
      return null;
    }
    try {
      await this.session.run(
        `MATCH (a:User {id:'${
          id
        }'}), (d:Date {id:'${dateId}'}) MERGE (a)-[r:CREATE]->(d)`
      );
    } catch (e) {
      console.log("createDate mutation error relationship create: ", e);
      return null;
    }
    return date;
  };
  createDateWinner = async ({ id, winnerId, dateId }: { id: string, winnerId: string, dateId: string }) => {
    let date;

    try {
      const data = await this.session.run(`MATCH (a:User{id:'${id}'})-[:CREATE]->(d:Date{id:'${dateId}'})<-[r:BID]-(b:User{id:'${winnerId}'}) 
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
    return date;
  };
  setFlagUser = ({ id, flaggedId, block }: { id: string, flaggedId: string, block: boolean | null }) => {

    if (block) {
      this.session
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

    return this.session
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
  };
  setBlockUser = ({ id, blockedId }: { id: string, blockedId: string }) => {
    return this.session
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
  };
}
