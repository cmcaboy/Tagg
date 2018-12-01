"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generated_1 = require("../../types/generated");
const index_1 = require("../../pubsub/index");
const subscriptions_1 = require("../../pubsub/subscriptions");
const graphql_subscriptions_1 = require("graphql-subscriptions");
exports.Subscription = Object.assign({}, generated_1.SubscriptionResolvers.defaultResolvers, { newMessageSub: {
        resolve: (payload) => payload.newMessageSub.message,
        subscribe: graphql_subscriptions_1.withFilter(() => index_1.pubsub.asyncIterator(subscriptions_1.NEW_MESSAGE), (payload, args) => {
            console.log("payload: ", payload);
            console.log("args: ", args);
            return (payload.newMessageSub.matchId === args.matchId &&
                payload.newMessageSub.message.uid != args.id);
        })
    } });
//# sourceMappingURL=Subscription.js.map