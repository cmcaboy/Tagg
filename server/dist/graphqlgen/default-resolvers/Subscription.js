"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generated_1 = require("../../types/generated");
exports.Subscription = Object.assign({}, generated_1.SubscriptionResolvers.defaultResolvers, { newMessageSub: {
        subscribe: (parent, args, ctx) => {
            throw new Error("Resolver not implemented");
        }
    } });
//# sourceMappingURL=Subscription.js.map