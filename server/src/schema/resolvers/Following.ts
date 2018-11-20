import { FollowingResolvers } from "../../types/generated";

export const Following: FollowingResolvers.Type = {
  ...FollowingResolvers.defaultResolvers,

  list: (_, __) => {
    throw new Error("Resolver not implemented");
  }
};
