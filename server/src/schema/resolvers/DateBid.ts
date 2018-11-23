import { DateBidResolvers } from "../../types/generated";

export const DateBid: DateBidResolvers.Type = {
  ...DateBidResolvers.defaultResolvers,

  dateUser: async ({ id }, _, { datasources }) => {
    return await datasources.neoAPI.getDateCreator({ id });
  },
  bidUser: async ({ id }, _, { datasources }) => {
    return await datasources.neoAPI.findDateBidder({ id });
  },
  date: async ({ id }, _, { datasources }) => {
    return await datasources.neoAPI.findDateFromBid({ id });
  }
};
