"use strict";
// This resolver file was scaffolded by github.com/prisma/graphqlgen, DO NOT EDIT.
// Please do not import this file directly but copy & paste to your application code.
Object.defineProperty(exports, "__esModule", { value: true });
var Query_1 = require("./Query");
var User_1 = require("./User");
var Following_1 = require("./Following");
var DateBidList_1 = require("./DateBidList");
var DateBid_1 = require("./DateBid");
var DateItem_1 = require("./DateItem");
var DateList_1 = require("./DateList");
var Queue_1 = require("./Queue");
var MatchList_1 = require("./MatchList");
var Match_1 = require("./Match");
var Message_1 = require("./Message");
var MessageItem_1 = require("./MessageItem");
var Mutation_1 = require("./Mutation");
var Subscription_1 = require("./Subscription");
exports.resolvers = {
    Query: Query_1.Query,
    User: User_1.User,
    Following: Following_1.Following,
    DateBidList: DateBidList_1.DateBidList,
    DateBid: DateBid_1.DateBid,
    DateItem: DateItem_1.DateItem,
    DateList: DateList_1.DateList,
    Queue: Queue_1.Queue,
    MatchList: MatchList_1.MatchList,
    Match: Match_1.Match,
    Message: Message_1.Message,
    MessageItem: MessageItem_1.MessageItem,
    Mutation: Mutation_1.Mutation,
    Subscription: Subscription_1.Subscription
};
