"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Query_1 = require("./Query");
const User_1 = require("./User");
const DateBid_1 = require("./DateBid");
const DateItem_1 = require("./DateItem");
const Match_1 = require("./Match");
const Mutation_1 = require("./Mutation");
const Subscription_1 = require("./Subscription");
const DateBidList_1 = require("./DateBidList");
const DateList_1 = require("./DateList");
const Following_1 = require("./Following");
const MatchList_1 = require("./MatchList");
const Message_1 = require("./Message");
const MessageItem_1 = require("./MessageItem");
const Queue_1 = require("./Queue");
exports.resolvers = {
    DateBid: DateBid_1.DateBid,
    DateBidList: DateBidList_1.DateBidList,
    DateItem: DateItem_1.DateItem,
    DateList: DateList_1.DateList,
    Following: Following_1.Following,
    Match: Match_1.Match,
    MatchList: MatchList_1.MatchList,
    Message: Message_1.Message,
    MessageItem: MessageItem_1.MessageItem,
    Mutation: Mutation_1.Mutation,
    Query: Query_1.Query,
    Queue: Queue_1.Queue,
    Subscription: Subscription_1.Subscription,
    User: User_1.User
};
//# sourceMappingURL=index.js.map