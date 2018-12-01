import { UserResolvers } from '../../types/generated';

export const User: UserResolvers.Type = {
  ...UserResolvers.defaultResolvers,

  hasDateOpen: async ({ id }, _, { dataSources }): Promise<boolean> => await dataSources.neoAPI.userHasDateOpen({ id }),
  distanceApart: async ({ id, distanceApart }, _, { dataSources }) => await dataSources.neoAPI.userDistanceApart({
    id,
    distanceApart,
  }),
  isFollowing: async ({ id, isFollowing }, _, { dataSources }) => await dataSources.neoAPI.userIsFollowing({
    id,
    isFollowing,
  }),
  following: async ({ id: idParent }, _, { dataSources, user }): Promise<any> => {
    const id = idParent || user.id;
    return await dataSources.neoAPI.getFollowersFromUser({
      id,
    });
  },
  bids: async ({ id: idParent }, _, { dataSources, user }) => {
    // If an id is passed in, use that; If not, use id in context
    const id = idParent || user.id;
    return await dataSources.neoAPI.findBidsFromUser({ id });
  },
  dateRequests: async ({ id: idParent }, _, { dataSources, user }) => {
    const id = idParent || user.id;
    return await dataSources.neoAPI.findDateRequests({ id });
  },
  queue: async ({ id: idParent, followerDisplay }, _, { dataSources, user }) => {
    const id = idParent || user.id;
    // console.log('queue id: ', id);
    return await dataSources.neoAPI.getUserQueue({ id, followerDisplay });
  },
  matchedDates: async ({ id: idParent }, _, { dataSources, user }) => {
    const id = idParent || user.id;
    return await dataSources.neoAPI.getMatchedDates({ id });
  },
};
