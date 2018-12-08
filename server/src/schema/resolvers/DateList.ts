import { DateListResolvers } from '../../types/generated';

export const DateList: DateListResolvers.Type = {
  ...DateListResolvers.defaultResolvers,

  // list: (_, __) => {
  //   throw new Error("Resolver not implemented");
  // }
};
