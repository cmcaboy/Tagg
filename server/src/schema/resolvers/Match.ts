import { MatchResolvers } from '../../types/generated';

export const Match: MatchResolvers.Type = {
  ...MatchResolvers.defaultResolvers,
  user: async ({ id }, _, { dataSources }) => await dataSources.neoAPI.findCreatorFromDate({ id }),
  messages: async ({ id, matchId }, _, { dataSources }) => await dataSources.firestoreAPI.getMessagesMatch({ id, matchId }),
  lastMessage: async ({ matchId }, _, { dataSources }) => await dataSources.firestoreAPI.getLastMessage({ matchId }),
};
