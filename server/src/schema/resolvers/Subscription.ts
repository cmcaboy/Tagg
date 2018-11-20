import { SubscriptionResolvers } from "../../types/generated";
import { pubsub } from "../../pubsub/index";
import { NEW_MESSAGE } from "../../pubsub/subscriptions";
import { withFilter } from "graphql-subscriptions";

export const Subscription: SubscriptionResolvers.Type = {
  ...SubscriptionResolvers.defaultResolvers,
  newMessageSub: {
    // The resolve method is executed after the subscribe method w/ filter
    resolve: (payload: any) => payload.newMessageSub.message,
    // For the withFilter function, the first argument is the tag that you are subscribing to.
    // The second argument is the filter.
    subscribe: withFilter(
      () => pubsub.asyncIterator(NEW_MESSAGE),
      (payload, args) => {
        console.log("payload: ", payload);
        console.log("args: ", args);
        return (
          payload.newMessageSub.matchId === args.matchId &&
          payload.newMessageSub.message.uid != args.id
        );
      }
    )
  }
};
