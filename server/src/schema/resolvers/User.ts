import { UserResolvers } from "../../types/generated";

export const User: UserResolvers.Type = {
  ...UserResolvers.defaultResolvers,

  hasDateOpen: async ({ id }, _, { datasources }): Promise<boolean> => {
    return await datasources.neoAPI.userHasDateOpen({ id });
  },
  distanceApart: async ({ id, hostId, distanceApart }, _, { datasources }) => {
    return await datasources.neoAPI.userDistanceApart({
      id,
      hostId,
      distanceApart
    });
  },
  isFollowing: async ({ id, hostId, isFollowing }, _, { datasources }) => {
    return await datasources.neoAPI.userIsFollowing({
      id,
      hostId,
      isFollowing
    });
  },
  following: async (
    { id, hostId, isFollowing },
    _,
    { datasources }
  ): Promise<any> => {
    return await datasources.neoAPI.getFollowersFromUser({
      id,
      hostId,
      isFollowing
    });
  },
  bids: async ({ id }, _, { datasources }) => {
    return await datasources.neoAPI.findBidsFromUser({ id });
  },
  dateRequests: async ({ id }, _, { datasources }) => {
    return await datasources.neoAPI.findDateRequests({ id });
  },
  queue: async ({ id, followerDisplay }, _, { datasources }) => {
    return await datasources.neoAPI.getUserQueue({ id, followerDisplay });
  },
  matchedDates: async ({ id }, _, { datasources }) => {
    return await datasources.neoAPI.getMatchedDates({ id });
  }
};
