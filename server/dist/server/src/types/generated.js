"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var QueryResolvers;
(function (QueryResolvers) {
    QueryResolvers.defaultResolvers = {};
})(QueryResolvers = exports.QueryResolvers || (exports.QueryResolvers = {}));
var UserResolvers;
(function (UserResolvers) {
    UserResolvers.defaultResolvers = {
        id: (parent) => (parent.id === undefined ? null : parent.id),
        active: (parent) => parent.active === undefined ? null : parent.active,
        name: (parent) => (parent.name === undefined ? null : parent.name),
        email: (parent) => (parent.email === undefined ? null : parent.email),
        age: (parent) => (parent.age === undefined ? null : parent.age),
        description: (parent) => parent.description === undefined ? null : parent.description,
        school: (parent) => parent.school === undefined ? null : parent.school,
        work: (parent) => (parent.work === undefined ? null : parent.work),
        sendNotifications: (parent) => parent.sendNotifications === undefined ? null : parent.sendNotifications,
        viewObjectionable: (parent) => parent.viewObjectionable === undefined ? null : parent.viewObjectionable,
        gender: (parent) => parent.gender === undefined ? null : parent.gender,
        distance: (parent) => parent.distance === undefined ? null : parent.distance,
        token: (parent) => (parent.token === undefined ? null : parent.token),
        latitude: (parent) => parent.latitude === undefined ? null : parent.latitude,
        longitude: (parent) => parent.longitude === undefined ? null : parent.longitude,
        minAgePreference: (parent) => parent.minAgePreference === undefined ? null : parent.minAgePreference,
        maxAgePreference: (parent) => parent.maxAgePreference === undefined ? null : parent.maxAgePreference,
        followerDisplay: (parent) => parent.followerDisplay === undefined ? null : parent.followerDisplay,
        match: (parent) => (parent.match === undefined ? null : parent.match),
        distanceApart: (parent) => parent.distanceApart === undefined ? null : parent.distanceApart,
        order: (parent) => (parent.order === undefined ? null : parent.order),
        registerDateTime: (parent) => parent.registerDateTime === undefined ? null : parent.registerDateTime,
        pics: (parent) => (parent.pics === undefined ? null : parent.pics),
        profilePic: (parent) => parent.profilePic === undefined ? null : parent.profilePic,
        hasDateOpen: (parent) => parent.hasDateOpen === undefined ? null : parent.hasDateOpen,
        isFollowing: (parent) => parent.isFollowing === undefined ? null : parent.isFollowing,
        objectionable: (parent) => parent.objectionable === undefined ? null : parent.objectionable
    };
})(UserResolvers = exports.UserResolvers || (exports.UserResolvers = {}));
var FollowingResolvers;
(function (FollowingResolvers) {
    FollowingResolvers.defaultResolvers = {
        id: (parent) => (parent.id === undefined ? null : parent.id),
        cursor: (parent) => parent.cursor === undefined ? null : parent.cursor
    };
})(FollowingResolvers = exports.FollowingResolvers || (exports.FollowingResolvers = {}));
var DateBidListResolvers;
(function (DateBidListResolvers) {
    DateBidListResolvers.defaultResolvers = {
        id: (parent) => (parent.id === undefined ? null : parent.id),
        cursor: (parent) => parent.cursor === undefined ? null : parent.cursor
    };
})(DateBidListResolvers = exports.DateBidListResolvers || (exports.DateBidListResolvers = {}));
var DateBidResolvers;
(function (DateBidResolvers) {
    DateBidResolvers.defaultResolvers = {
        id: (parent) => (parent.id === undefined ? null : parent.id),
        datetimeOfBid: (parent) => parent.datetimeOfBid === undefined ? null : parent.datetimeOfBid,
        bidDescription: (parent) => parent.bidDescription === undefined ? null : parent.bidDescription,
        bidPlace: (parent) => parent.bidPlace === undefined ? null : parent.bidPlace
    };
})(DateBidResolvers = exports.DateBidResolvers || (exports.DateBidResolvers = {}));
var DateItemResolvers;
(function (DateItemResolvers) {
    DateItemResolvers.defaultResolvers = {
        id: (parent) => (parent.id === undefined ? null : parent.id),
        creationTime: (parent) => parent.creationTime === undefined ? null : parent.creationTime,
        datetimeOfDate: (parent) => parent.datetimeOfDate === undefined ? null : parent.datetimeOfDate,
        description: (parent) => parent.description === undefined ? null : parent.description,
        num_bids: (parent) => parent.num_bids === undefined ? null : parent.num_bids,
        open: (parent) => parent.open === undefined ? null : parent.open,
        creationTimeEpoch: (parent) => parent.creationTimeEpoch === undefined ? null : parent.creationTimeEpoch,
        order: (parent) => parent.order === undefined ? null : parent.order
    };
})(DateItemResolvers = exports.DateItemResolvers || (exports.DateItemResolvers = {}));
var DateListResolvers;
(function (DateListResolvers) {
    DateListResolvers.defaultResolvers = {
        id: (parent) => (parent.id === undefined ? null : parent.id),
        cursor: (parent) => parent.cursor === undefined ? null : parent.cursor
    };
})(DateListResolvers = exports.DateListResolvers || (exports.DateListResolvers = {}));
var QueueResolvers;
(function (QueueResolvers) {
    QueueResolvers.defaultResolvers = {
        id: (parent) => (parent.id === undefined ? null : parent.id),
        cursor: (parent) => parent.cursor === undefined ? null : parent.cursor
    };
})(QueueResolvers = exports.QueueResolvers || (exports.QueueResolvers = {}));
var MatchListResolvers;
(function (MatchListResolvers) {
    MatchListResolvers.defaultResolvers = {
        id: (parent) => (parent.id === undefined ? null : parent.id),
        cursor: (parent) => parent.cursor === undefined ? null : parent.cursor
    };
})(MatchListResolvers = exports.MatchListResolvers || (exports.MatchListResolvers = {}));
var MatchResolvers;
(function (MatchResolvers) {
    MatchResolvers.defaultResolvers = {
        id: (parent) => (parent.id === undefined ? null : parent.id),
        matchId: (parent) => parent.matchId === undefined ? null : parent.matchId,
        description: (parent) => parent.description === undefined ? null : parent.description,
        datetimeOfDate: (parent) => parent.datetimeOfDate === undefined ? null : parent.datetimeOfDate
    };
})(MatchResolvers = exports.MatchResolvers || (exports.MatchResolvers = {}));
var MessageResolvers;
(function (MessageResolvers) {
    MessageResolvers.defaultResolvers = {
        id: (parent) => (parent.id === undefined ? null : parent.id),
        cursor: (parent) => parent.cursor === undefined ? null : parent.cursor
    };
})(MessageResolvers = exports.MessageResolvers || (exports.MessageResolvers = {}));
var MessageItemResolvers;
(function (MessageItemResolvers) {
    MessageItemResolvers.defaultResolvers = {
        name: (parent) => parent.name === undefined ? null : parent.name,
        avatar: (parent) => parent.avatar === undefined ? null : parent.avatar,
        _id: (parent) => parent._id === undefined ? null : parent._id,
        createdAt: (parent) => parent.createdAt === undefined ? null : parent.createdAt,
        text: (parent) => parent.text === undefined ? null : parent.text,
        order: (parent) => parent.order === undefined ? null : parent.order,
        uid: (parent) => (parent.uid === undefined ? null : parent.uid)
    };
})(MessageItemResolvers = exports.MessageItemResolvers || (exports.MessageItemResolvers = {}));
var MutationResolvers;
(function (MutationResolvers) {
    MutationResolvers.defaultResolvers = {};
})(MutationResolvers = exports.MutationResolvers || (exports.MutationResolvers = {}));
var SubscriptionResolvers;
(function (SubscriptionResolvers) {
    SubscriptionResolvers.defaultResolvers = {};
})(SubscriptionResolvers = exports.SubscriptionResolvers || (exports.SubscriptionResolvers = {}));
//# sourceMappingURL=generated.js.map