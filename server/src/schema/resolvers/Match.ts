import { MatchResolvers } from "../../types/generated";
import { db } from "../../db/firestore";
import { driver } from "../../db/neo4j";
import { MESSAGE_PAGE_LENGTH } from "./variables";

const session = driver.session();

export const Match: MatchResolvers.Type = {
  ...MatchResolvers.defaultResolvers,
  user: (parentValue, _) => {
    return session
      .run(`MATCH(a:User)-[:CREATE]->(d:Date{id:'${parentValue.id}'}) RETURN a`)
      .then((result: any) => result.records[0])
      .then((record: any) => record._fields[0].properties)
      .catch((e: string) => console.log("winner error: ", e));
  },
  messages: async (parentValue, args) => {
    console.log("messages resolver");
    console.log("parentValue.matchId: ", parentValue.matchId);
    console.log("args: ", args);
    if (!parentValue.matchId) {
      return {
        id: parentValue.id,
        list: [],
        cursor: null
      };
    }
    const data = await db
      .collection(`matches/${parentValue.matchId}/messages`)
      .orderBy("createdAt", "desc")
      .limit(MESSAGE_PAGE_LENGTH)
      .get();

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

    const cursor =
      messages.length > 0 ? messages[messages.length - 1].order : null;

    console.log("messages in messages: ", messages);

    return {
      id: parentValue.id,
      cursor,
      list: messages
    };
  },
  lastMessage: async (parentValue, args) => {
    console.log("lastMessage resolver");
    console.log("parentValue.matchId: ", parentValue.matchId);
    console.log("args: ", args);
    if (!parentValue.matchId) {
      return null;
    }

    try {
      // Can use a desc option if orderBy if I need to get opposite order.
      // citiesRef.orderBy("state").orderBy("population", "desc")
      const data = await db
        .collection(`matches/${parentValue.matchId}/messages`)
        .orderBy("createdAt", "desc")
        .limit(1)
        .get();

      if (!data.docs) {
        return null;
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

      // This array should only have 1 element, but I want to return just the element rather than a 1 length array.
      return messages[0];
    } catch (e) {
      console.log("error fetching last message: ", e);
      return null;
    }
  }
};
