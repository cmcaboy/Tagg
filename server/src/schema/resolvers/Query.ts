import { QueryResolvers } from '../../types/generated';

export const Query: QueryResolvers.Type = {
  ...QueryResolvers.defaultResolvers,
  user: async (_, { id, hostId }, { dataSources, user }) => {
    console.log('user: ', user);
    return await dataSources.neoAPI.findUser({ id: user.id, hostId });
  },
  messages: async (_, { id }, { datasources }) => await datasources.firestoreAPI.getMessages({ id }),
  date: async (_, { id }, { datasources }) => await datasources.neoAPI.findDate({ id }),
  dates: (_, __) => {
    throw new Error('Resolver not implemented');
  },
  otherBids: async (_, { id }, { datasources }) => await datasources.neoAPI.findOtherBids({ id }),
  moreMessages: async (_, { id, cursor }, { datasources }) => await datasources.firestoreAPI.getMoreMessages({ id, cursor }),
  moreQueue: async (_, { id, cursor, followerDisplay }, { datasources }) => await datasources.neoAPI.getQueueMore({
    id,
    cursor,
    followerDisplay,
  }),
  moreDates: (_, __) => {
    throw new Error('Resolver not implemented');
  },
  moreDateBids: (_, __) => {
    throw new Error('Resolver not implemented');
  },
  moreFollowing: (_, __) => {
    throw new Error('Resolver not implemented');
  },
};
