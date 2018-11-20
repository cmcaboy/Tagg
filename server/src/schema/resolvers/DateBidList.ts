import { DateBidListResolvers } from "../../types/generated";

export const DateBidList: DateBidListResolvers.Type = {
  ...DateBidListResolvers.defaultResolvers,

  list: (_, __) => {
    throw new Error("Resolver not implemented");
  }
};
