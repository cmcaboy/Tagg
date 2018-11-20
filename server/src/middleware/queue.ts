import { driver } from "../db/neo4j";
const session = driver.session();

const QUEUE_PAGE_LENGTH = 5;

export const getQueue = async ({
  id,
  followerDisplay
}: {
  id: string;
  followerDisplay: any;
}) => {
  console.log("id: ", id);
  //console.log('args: ',args);
  // for pagination, I would like to sort by the following algorithm
  // order = [1/(# of likes)] x (distanceApart) x (time on platform)
  // Priority is given by the lowest order number.
  // I don't have 'time on platform' factored in yet, but I will add it soon.
  // The query is sorted by smallest value first by default.

  // let followerDisplay;

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
    const viewObjectionableRaw = await session.run(
      `MATCH(a:User{id:'${id}}) return a.viewObjectionable`
    );
    const viewObjectionableResult = viewObjectionableRaw.records[0].fields[0];

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

  console.log("followQuery: ", followQuery);

  let query = `MATCH(a:User{id:'${id}'}),(b:User)
    WITH a,b, size((b)<-[:FOLLOWING]-()) as num_likes,
    distance(point(a),point(b))*0.000621371 as distanceApart,
    ((distance(point(a),point(b))*0.000621371)*(1/toFloat((SIZE((b)<-[:FOLLOWING]-())+1)))) as order,
    exists((a)-[:FOLLOWING]->(b)) as isFollowing,
    exists((b)-[:CREATE]->(:Date{open:TRUE})) as hasDateOpen
    where 
    NOT (b)-[:BLOCK]->(a) AND
    NOT b.id=a.id AND
    NOT b.gender=a.gender AND
    distanceApart < a.distance
    ${followQuery}
    ${viewObjectionable}
    RETURN b, distanceApart, num_likes, order, isFollowing, hasDateOpen
    ORDER BY order
    LIMIT ${QUEUE_PAGE_LENGTH}`;

  console.log("query: ", query);

  return session
    .run(query)
    .then((result: any) => result.records)
    .then((records: any[]) => {
      const list = records.map((record: any) => {
        console.log("queue record: ", record);
        // console.log('field 0: ',record._fields[0]);
        // console.log('field 1: ',record._fields[1]);
        // console.log('field 2: ',record._fields[2]);
        // console.log('field 3: ',record._fields[3]);
        // console.log('field 4: ',record._fields[4]);
        // console.log('field 5: ',record._fields[5]);
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

      const newCursor =
        list.length >= QUEUE_PAGE_LENGTH ? list[list.length - 1].order : null;

      return {
        list,
        cursor: newCursor,
        id: `${id}q`
      };
    })
    .catch((e: string) => {
      console.log("queue error: ", e);
      return {
        list: [],
        cursor: null,
        id: `${id}q`
      };
    });
};
