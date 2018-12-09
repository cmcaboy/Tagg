import { DateBidResolvers } from '../../types/generated';

export const DateBid: DateBidResolvers.Type = {
  ...DateBidResolvers.defaultResolvers,

  dateUser: async ({ id }, _, { dataSources }) => await dataSources.neoAPI.getDateCreator({ id }),
  bidUser: async ({ id }, _, { dataSources }) => {
    console.log('bidUser parent id: ', id);
    return await dataSources.neoAPI.findDateBidder({ id });
  },
  date: async ({ id }, _, { dataSources }) => await dataSources.neoAPI.findDateFromBid({ id }),
};
