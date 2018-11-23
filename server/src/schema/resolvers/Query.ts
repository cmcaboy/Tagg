import { QueryResolvers } from "../../types/generated";

export const Query: QueryResolvers.Type = {
  ...QueryResolvers.defaultResolvers,
  user: async (_, { id, hostId }, { dataSources }) => {
    return await dataSources.neoAPI.findUser({ id, hostId });
  },
  messages: async (_, { id }, { datasources }) => {
    return await datasources.firestoreAPI.getMessages({ id });
  },
  date: async (_, { id }, { datasources }) => {
    return await datasources.neoAPI.findDate({ id });
  },
  dates: (_, __) => {
    throw new Error("Resolver not implemented");
  },
  otherBids: async (_, { id }, { datasources }) => {
    // dateID should be passed in as the id
    // Need to factor in pagination
    // Should sort by date?
    return await datasources.neoAPI.findOtherBids({ id });
  },
  moreMessages: async (_, { id, cursor }, { datasources }) => {
    return await datasources.firestoreAPI.getMoreMessages({ id, cursor });
  },
  moreQueue: async (_, { id, cursor, followerDisplay }, { datasources }) => {
    return await datasources.neoAPI.getQueueMore({
      id,
      cursor,
      followerDisplay
    });
  },
  moreDates: (_, __) => {
    throw new Error("Resolver not implemented");
  },
  moreDateBids: (_, __) => {
    throw new Error("Resolver not implemented");
  },
  moreFollowing: (_, __) => {
    throw new Error("Resolver not implemented");
  }
};
