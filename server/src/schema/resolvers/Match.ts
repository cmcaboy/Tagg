import { MatchResolvers } from '../../types/generated';

export const Match: MatchResolvers.Type = {
  ...MatchResolvers.defaultResolvers,
  user: async ({ id }, _, { datasources }) => await datasources.neoAPI.findCreatorFromDate({ id }),
  messages: async ({ id, matchId }, _, { datasources }) => await datasources.firestoreAPI.getMessagesMatch({ id, matchId }),
  lastMessage: async ({ matchId }, _, { datasources }) => await datasources.firestoreAPI.getLastMessage({ matchId }),
};

