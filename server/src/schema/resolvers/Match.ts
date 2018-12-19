import { MatchResolvers } from '../../types/generated';

export const Match: MatchResolvers.Type = {
  ...MatchResolvers.defaultResolvers,
  user: async ({ winnerId: id }, _, { dataSources, id: hostId }) => await dataSources.neoAPI.findUser({ id, hostId }),
  // user: async ({ matchId: id }, _, { dataSources }) => {
  //   console.log('Match.user id: ', id);
  //   return await dataSources.neoAPI.findCreatorFromDate({ id });
  // },
  messages: async ({ id, matchId }, _, { dataSources }) => await dataSources.firestoreAPI.getMessagesMatch({ id, matchId }),
  lastMessage: async ({ matchId }, _, { dataSources }) => await dataSources.firestoreAPI.getLastMessage({ matchId }),
};
