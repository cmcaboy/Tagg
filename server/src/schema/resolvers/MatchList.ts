import { MatchListResolvers } from '../../types/generated';

export const MatchList: MatchListResolvers.Type = {
  ...MatchListResolvers.defaultResolvers,

  // list: (_, __) => {
  //   throw new Error("Resolver not implemented");
  // }
};
