import { DateItemResolvers } from '../../types/generated';

export const DateItem: DateItemResolvers.Type = {
  ...DateItemResolvers.defaultResolvers,

  creator: async ({ id }, _, { dataSources }) => await dataSources.neoAPI.findCreatorFromDate({ id }),
  num_bids: async ({ id }, _, { dataSources, user: { id: hostId } }) => await dataSources.neoAPI.findNumberOfBidsFromDate({ id, hostId }),
  winner: async ({ id }, _, { dataSources }) => await dataSources.neoAPI.findDateWinner({ id }),
  bids: async ({ id }, _, { dataSources }) => await dataSources.neoAPI.findBidsFromDate({ id }),
};
