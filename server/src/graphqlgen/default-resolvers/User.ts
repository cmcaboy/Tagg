// This resolver file was scaffolded by github.com/prisma/graphqlgen, DO NOT EDIT.
// Please do not import this file directly but copy & paste to your application code.

import { UserResolvers } from "../../types/generated";

export const User: UserResolvers.Type = {
  ...UserResolvers.defaultResolvers,

  following: (parent, args, ctx) => {
    throw new Error("Resolver not implemented");
  },
  bids: (parent, args, ctx) => {
    throw new Error("Resolver not implemented");
  },
  dateRequests: (parent, args, ctx) => {
    throw new Error("Resolver not implemented");
  },
  queue: (parent, args, ctx) => {
    throw new Error("Resolver not implemented");
  },
  matchedDates: (parent, args, ctx) => {
    throw new Error("Resolver not implemented");
  }
};
