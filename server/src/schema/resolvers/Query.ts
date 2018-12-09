import { QueryResolvers } from '../../types/generated';

const { AuthenticationError } = require('apollo-server');

export const Query: QueryResolvers.Type = {
  ...QueryResolvers.defaultResolvers,
  user: async (_, { id: argsId, hostId }, { dataSources, user }) => {
    // if id was passed in as argument, use it. If not, use
    // the id in context`
    if (!user || !user.id) {
      console.log('User not authenticated');
      throw new AuthenticationError('User not authenticated');
    }

    const id = argsId || user.id;

    return await dataSources.neoAPI.findUser({ id, hostId });
  },
  messages: async (_, { id }, { dataSources }) => await dataSources.firestoreAPI.getMessages({ id }),
  date: async (_, { id }, { dataSources }) => await dataSources.neoAPI.findDate({ id }),
  dates: (_, __) => {
    throw new Error('Resolver not implemented');
  },
  otherBids: async (_, { id: dateId }, { dataSources, user }) => {
    if (!user || !user.id) {
      console.log('User not authenticated');
      throw new AuthenticationError('User not authenticated');
    }

    return await dataSources.neoAPI.findOtherBids({ id: dateId });
  },
  moreMessages: async (_, { id, cursor }, { dataSources }) => await dataSources.firestoreAPI.getMoreMessages({ id, cursor }),
  moreQueue: async (_, { cursor, followerDisplay }, { dataSources, user }) => {
    if (!user || !user.id) {
      console.log('User not authenticated');
      throw new AuthenticationError('User not authenticated');
    }
    return await dataSources.neoAPI.getQueueMore({
      cursor,
      followerDisplay,
    });
  },
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
