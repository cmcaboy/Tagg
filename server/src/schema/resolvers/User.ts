import { UserResolvers } from '../../types/generated';

export const User: UserResolvers.Type = {
  ...UserResolvers.defaultResolvers,

  hasDateOpen: async ({ id }, _, { datasources }): Promise<boolean> => await datasources.neoAPI.userHasDateOpen({ id }),
  distanceApart: async ({ id, distanceApart }, _, { datasources }) => await datasources.neoAPI.userDistanceApart({
    id,
    distanceApart,
  }),
  isFollowing: async ({ id, isFollowing }, _, { datasources }) => await datasources.neoAPI.userIsFollowing({
    id,
    isFollowing,
  }),
  following: async ({ id: idParent }, _, { datasources, user }): Promise<any> => {
    const id = idParent || user.id;
    return await datasources.neoAPI.getFollowersFromUser({
      id,
    });
  },
  bids: async ({ id: idParent }, _, { datasources, user }) => {
    // If an id is passed in, use that; If not, use id in context
    const id = idParent || user.id;
    return await datasources.neoAPI.findBidsFromUser({ id });
  },
  dateRequests: async ({ id: idParent }, _, { datasources, user }) => {
    const id = idParent || user.id;
    return await datasources.neoAPI.findDateRequests({ id });
  },
  queue: async ({ id: idParent, followerDisplay }, _, { datasources, user }) => {
    const id = idParent || user.id;
    return await datasources.neoAPI.getUserQueue({ id, followerDisplay });
  },
  matchedDates: async ({ id: idParent }, _, { datasources, user }) => {
    const id = idParent || user.id;
    return await datasources.neoAPI.getMatchedDates({ id });
  },
};
