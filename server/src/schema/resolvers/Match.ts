import { MatchResolvers } from "../../types/generated";
import { db } from "../../db/firestore";
import { driver } from "../../db/neo4j";
import { MESSAGE_PAGE_LENGTH } from "./variables";

export const Match: MatchResolvers.Type = {
  ...MatchResolvers.defaultResolvers,
  user: async ({ id }, _, { datasources }) => {
    return await datasources.neoAPI.findCreatorFromDate({ id });
  },
  messages: async ({ id, matchId }, _, { datasources }) => {
    return await datasources.firestoreAPI.getMessagesMatch({ id, matchId });
  },
  lastMessage: async ({ matchId }, _, { datasources }) => {
    return await datasources.firestoreAPI.getLastMessage({ matchId });
  }
};
