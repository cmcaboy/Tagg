import { MessageResolvers } from '../../types/generated';

export const Message: MessageResolvers.Type = {
  ...MessageResolvers.defaultResolvers,

  // list: (_, __) => {
  //   throw new Error("Resolver not implemented");
  // }
};
