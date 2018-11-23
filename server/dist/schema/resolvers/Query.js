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
const { AuthenticationError } = require('apollo-server');
exports.Query = Object.assign({}, generated_1.QueryResolvers.defaultResolvers, { user: (_, { id: argsId, hostId }, { dataSources, user }) => __awaiter(this, void 0, void 0, function* () {
        if (!user || !user.id) {
            console.log('User not authenticated');
            throw new AuthenticationError('User not authenticated');
        }
        const id = argsId || user.id;
        return yield dataSources.neoAPI.findUser({ id, hostId });
    }), messages: (_, { id }, { datasources }) => __awaiter(this, void 0, void 0, function* () { return yield datasources.firestoreAPI.getMessages({ id }); }), date: (_, { id }, { datasources }) => __awaiter(this, void 0, void 0, function* () { return yield datasources.neoAPI.findDate({ id }); }), dates: (_, __) => {
        throw new Error('Resolver not implemented');
    }, otherBids: (_, { id }, { datasources }) => __awaiter(this, void 0, void 0, function* () { return yield datasources.neoAPI.findOtherBids({ id }); }), moreMessages: (_, { id, cursor }, { datasources }) => __awaiter(this, void 0, void 0, function* () { return yield datasources.firestoreAPI.getMoreMessages({ id, cursor }); }), moreQueue: (_, { cursor, followerDisplay }, { datasources, user }) => __awaiter(this, void 0, void 0, function* () {
        if (!user || !user.id) {
            console.log('User not authenticated');
            throw new AuthenticationError('User not authenticated');
        }
        return yield datasources.neoAPI.getQueueMore({
            cursor,
            followerDisplay,
        });
    }), moreDates: (_, __) => {
        throw new Error('Resolver not implemented');
    }, moreDateBids: (_, __) => {
        throw new Error('Resolver not implemented');
    }, moreFollowing: (_, __) => {
        throw new Error('Resolver not implemented');
    } });
//# sourceMappingURL=Query.js.map