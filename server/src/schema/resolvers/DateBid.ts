import { DateBidResolvers } from "../../types/generated";
import { driver } from "../../db/neo4j";

const session = driver.session();

export const DateBid: DateBidResolvers.Type = {
  ...DateBidResolvers.defaultResolvers,

  dateUser: (parentValue, _) => {
    return session
      .run(
        `MATCH(a:User)-[:CREATE]->(d:Date)<-[r:BID{id:'${
          parentValue.id
        }'}]-(b:User)
                  RETURN a`
      )
      .then((result: any) => result.records[0])
      .then((record: any) => record._fields[0].properties)
      .catch((e: string) => console.log("winner error: ", e));
  },
  bidUser: (parentValue, _) => {
    return session
      .run(
        `MATCH(a:User)-[:CREATE]->(d:Date)<-[r:BID{id:'${
          parentValue.id
        }'}]-(b:User)
                  RETURN b`
      )
      .then((result: any) => result.records[0])
      .then((record: any) => record._fields[0].properties)
      .catch((e: string) => console.log("winner error: ", e));
  },
  date: (parentValue, _) => {
    return session
      .run(
        `MATCH(a:User)-[:CREATE]->(d:Date)<-[r:BID{id:'${
          parentValue.id
        }'}]-(b:User)
                  RETURN d`
      )
      .then((result: any) => result.records[0])
      .then((record: any) => record._fields[0].properties)
      .catch((e: string) => console.log("winner error: ", e));
  }
};
