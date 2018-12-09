import { DateBidResolvers } from '../../types/generated';

export const DateBid: DateBidResolvers.Type = {
  ...DateBidResolvers.defaultResolvers,

  dateUser: async ({ id }, _, { dataSources }) => await dataSources.neoAPI.getDateCreator({ id }),
  bidUser: async ({ id }, _, { dataSources }) => dataSources.neoAPI.findUser({ id }),
  date: async ({ id }, _, { dataSources }) => await dataSources.neoAPI.findDateFromBid({ id }),
};
