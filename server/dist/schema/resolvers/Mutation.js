"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const generated_1 = require("../../types/generated");
const format_1 = require("../../middleware/format");
const index_1 = require("../../pubsub/index");
const subscriptions_1 = require("../../pubsub/subscriptions");
const newMessagePush_1 = require("../../middleware/newMessagePush");
const createDatePush_1 = require("../../middleware/createDatePush");
const chooseWinnerPush_1 = require("../../middleware/chooseWinnerPush");
const uuid = require('node-uuid');
exports.Mutation = Object.assign({}, generated_1.MutationResolvers.defaultResolvers, { editUser: (_, args, { datasources }) => __awaiter(this, void 0, void 0, function* () { return yield datasources.neoAPI.setUser(args); }), editUserQueue: (_, args, { datasources }) => __awaiter(this, void 0, void 0, function* () { return yield datasources.neoAPI.setUserQueue(args); }), newUser: (_, tempArgs, { datasources }) => __awaiter(this, void 0, void 0, function* () { return yield datasources.neoAPI.createUser(tempArgs); }), newMessage: (_, args, { datasoures }) => __awaiter(this, void 0, void 0, function* () {
        const message = {
            _id: args._id,
            name: args.name,
            text: args.text,
            avatar: args.avatar,
            createdAt: format_1.getCurrentDateFirestore(),
            order: args.order,
            uid: args.uid,
        };
        const asyncFunc = () => __awaiter(this, void 0, void 0, function* () {
            index_1.pubsub.publish(subscriptions_1.NEW_MESSAGE, {
                newMessageSub: { message, matchId: args.matchId },
            });
            newMessagePush_1.newMessagePush({
                matchId: args.matchId,
                otherId: args.uid,
                otherName: args.name,
                otherPic: args.avatar,
                text: args.text,
                id: args.receiverId,
            });
        });
        asyncFunc();
        const sendMessage = yield datasoures.firestoreAPI.createMessage(args);
        if (!sendMessage) {
            return null;
        }
        console.log(`${args.name} posted message to matchId ${args.matchId}`);
        return message;
    }), follow: (_, { followId, isFollowing }, { datasources }) => __awaiter(this, void 0, void 0, function* () { return yield datasources.neoAPI.followUser({ followId, isFollowing }); }), unFollow: (_, { unFollowId }, { datasources }) => __awaiter(this, void 0, void 0, function* () { return yield datasources.neoAPI.unFollowUser({ unFollowId }); }), bid: (_, args, { datasources }) => __awaiter(this, void 0, void 0, function* () {
        const datetimeOfBid = format_1.getCurrentDateNeo();
        const bidId = uuid();
        return yield datasources.neoAPI.createbid(Object.assign({}, args, { bidId,
            datetimeOfBid }));
    }), createDate: (_, args, { datasources, user: { id } }) => __awaiter(this, void 0, void 0, function* () {
        const creationTime = format_1.getCurrentDateNeo();
        const dateId = uuid();
        const date = yield datasources.neoAPI.createDate(Object.assign({}, args, { creationTime,
            dateId }));
        createDatePush_1.createDatePush(id, date);
        return date;
    }), chooseWinner: (_, { winnerId, dateId }, { datasources, user: { id } }) => __awaiter(this, void 0, void 0, function* () {
        const date = yield datasources.neoAPI.createDateWinner({
            winnerId,
            dateId,
        });
        const firestoreCreation = yield datasources.firestoreAPI.createDateChat({
            id,
            winnerId,
            dateId,
            date,
        });
        if (!firestoreCreation) {
            console.log(`Failed to create date ${dateId} in firestore!`);
        }
        chooseWinnerPush_1.chooseWinnerPushWinner(date);
        chooseWinnerPush_1.chooseWinnerPushLoser(date);
        return date;
    }), flag: (_, { flaggedId, block }, { datasources }) => __awaiter(this, void 0, void 0, function* () { return yield datasources.neoAPI.setFlagUser({ flaggedId, block }); }), block: (_, { blockedId }, { datasources }) => __awaiter(this, void 0, void 0, function* () { return yield datasources.neoAPI.setUserBlock({ blockedId }); }) });
//# sourceMappingURL=Mutation.js.map