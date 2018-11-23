import { DateItemResolvers } from "../../types/generated";

export const DateItem: DateItemResolvers.Type = {
  ...DateItemResolvers.defaultResolvers,

  creator: async ({ id }, _, { datasources }) => {
    return await datasources.neoAPI.findCreatorFromDate({ id });
  },
  num_bids: async ({ id }, _, { datasources }) => {
    return await datasources.neoAPI.findNumberOfBidsFromDate({ id });
  },
  winner: async ({ id }, _, { datasources }) => {
    return await datasources.neoAPI.findDateWinner({ id });
  },
  bids: async ({ id }, _, { datasources }) => {
    return await datasources.neoAPI.findBidsFromDate({ id });
  }
};
