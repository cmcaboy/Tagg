import { DateItemResolvers } from "../../types/generated";

import { driver } from "../../db/neo4j";

const session = driver.session();

export const DateItem: DateItemResolvers.Type = {
  ...DateItemResolvers.defaultResolvers,

  creator: (parentValue, _) => {
    return session
      .run(
        `MATCH(a:User)-[:CREATE]->(d:Date{id:'${parentValue.id}'})
                  RETURN a`
      )
      .then((result: any) => result.records[0])
      .then((record: any) => record._fields[0].properties)
      .catch((e: string) => console.log("creator error: ", e));
  },
  num_bids: (parentValue, _) => {
    return session
      .run(
        `MATCH(d:Date{id:'${parentValue.id}'})
                  WITH size((d)<-[:BID]-(:User)) as num_bids
                  return num_bids`
      )
      .then((result: any) => result.records[0])
      .then((record: any) => record._fields[0])
      .catch((e: string) => console.log("num_bids error: ", e));
  },
  winner: (parentValue, _) => {
    return session
      .run(
        `MATCH(d:Date{id:'${parentValue.id}'})<-[r:BID{winner:TRUE}]-(b:User)
                  RETURN b`
      )
      .then((result: any) => result.records[0])
      .then((record: any) => record._fields[0].properties)
      .catch((e: string) => console.log("winner error: ", e));
  },
  bids: (parentValue, _) => {
    return session
      .run(`MATCH(b:User)-[r:BID]->(d:Date{id:'${parentValue.id}'}) RETURN r`)
      .then((result: any) => result.records)
      .then((records: any[]) => {
        const list = records.map(record => ({
          ...record._fields[0].properties
        }));
        return {
          id: `${parentValue.id}b`,
          list,
          cursor: null
        };
      })
      .catch((e: any) => console.log("bid error: ", e));
  }
};
