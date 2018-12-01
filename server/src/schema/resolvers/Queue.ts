import { QueueResolvers } from '../../types/generated';

export const Queue: QueueResolvers.Type = {
  ...QueueResolvers.defaultResolvers,

  // list: (_, __) => {
  //   throw new Error("Resolver not implemented");
  // }
};
