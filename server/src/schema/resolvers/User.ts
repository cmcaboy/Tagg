import { UserResolvers } from "../../types/generated";
import { getQueue } from "../../middleware/queue";
import { driver } from "../../db/neo4j";

const session = driver.session();

export const User: UserResolvers.Type = {
  ...UserResolvers.defaultResolvers,

  hasDateOpen: (parentValue, _): Promise<boolean> => {
    console.log("following parentValue: ", parentValue);
    return session
      .run(
        `MATCH(a:User{id:'${parentValue.id}'}) 
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
  },
  distanceApart: (parentValue, _) => {
    // hostId is only used for UserProfile
    if (!parentValue.hostId) return parentValue.distanceApart;

    return session
      .run(
        `MATCH(a:User{id:'${parentValue.hostId}'}),(b:User{id:'${
          parentValue.id
        }'})
              WITH  distance(point(a),point(b))*0.000621371 as distanceApart
              RETURN distanceApart`
      )
      .then((result: any): any => result.records[0])
      .then((record: any): number => record._fields[0])
      .catch((e: string) => console.log("distanceApart error: ", e));
  },
  isFollowing: (parentValue, _) => {
    // Could pass in host user has an optional argument

    // hostId is only used for UserProfile
    if (!parentValue.hostId) return parentValue.isFollowing;

    return session
      .run(
        `MATCH(a:User{id:'${parentValue.hostId}'}),(b:User{id:'${
          parentValue.id
        }'})
              WITH exists((a)-[:FOLLOWING]->(b)) as isFollowing
              RETURN isFollowing`
      )
      .then((result: any): any => result.records[0])
      .then((record: any): boolean => record._fields[0])
      .catch((e: string) => console.log("isFollowing error: ", e));
  },
  following: (parentValue, _): Promise<any> => {
    // Need to factor in pagination
    console.log("following parentValue: ", parentValue);
    return session
      .run(
        `MATCH(a:User{id:'${parentValue.id}'})-[r:FOLLOWING]->(b:User) 
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
          id: `${parentValue.id}f`,
          list,
          cursor: null
        };
      })
      .catch((e: string) => console.log("following error: ", e));
  },
  bids: (parentValue, _) => {
    console.log("bids parentValue: ", parentValue);
    // Need to factor in pagination
    return session
      .run(
        `MATCH(a:User{id:'${
          parentValue.id
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
            id: `${parentValue.id}b`,
            list,
            cursor: null
          };
        }
      )
      .catch((e: string) => console.log("bid error: ", e));
  },
  dateRequests: (parentValue, _) => {
    // Need to factor in pagination
    console.log("dateRequests parentValue: ", parentValue);
    return session
      .run(
        `MATCH(a:User{id:'${parentValue.id}'})-[:CREATE]->(d:Date) 
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
          id: `${parentValue.id}d`,
          list,
          cursor: null
        };
      })
      .catch((e: string) => console.log("dateRequest error: ", e));
  },
  queue: (parentValue, _) => getQueue(parentValue),
  matchedDates: (parentValue, _) => {
    // A potential performance improvement would be to query Firestore directly
    // to get our list of matches
    // These matches should be sorted as well.

    //console.log('args: ',args);
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
            id: `${parentValue.id}m`,
            list: [],
            cursor: null
          };
        }

        //const newCursor = list.length >= MATCH_PAGE_LENGTH ? list[list.length - 1].order : null;
        const newCursor = null;
        console.log("matchedDates list: ", list);

        return {
          id: `${parentValue.id}m`,
          list,
          cursor: newCursor
        };
      })
      .catch((e: string) => console.log("matches error: ", e));
  }
};
