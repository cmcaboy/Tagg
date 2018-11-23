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
exports.User = Object.assign({}, generated_1.UserResolvers.defaultResolvers, { hasDateOpen: ({ id }, _, { datasources }) => __awaiter(this, void 0, void 0, function* () { return yield datasources.neoAPI.userHasDateOpen({ id }); }), distanceApart: ({ id, distanceApart }, _, { datasources }) => __awaiter(this, void 0, void 0, function* () {
        return yield datasources.neoAPI.userDistanceApart({
            id,
            distanceApart,
        });
    }), isFollowing: ({ id, isFollowing }, _, { datasources }) => __awaiter(this, void 0, void 0, function* () {
        return yield datasources.neoAPI.userIsFollowing({
            id,
            isFollowing,
        });
    }), following: ({ id: idParent }, _, { datasources, user }) => __awaiter(this, void 0, void 0, function* () {
        const id = idParent || user.id;
        return yield datasources.neoAPI.getFollowersFromUser({
            id,
        });
    }), bids: ({ id: idParent }, _, { datasources, user }) => __awaiter(this, void 0, void 0, function* () {
        const id = idParent || user.id;
        return yield datasources.neoAPI.findBidsFromUser({ id });
    }), dateRequests: ({ id: idParent }, _, { datasources, user }) => __awaiter(this, void 0, void 0, function* () {
        const id = idParent || user.id;
        return yield datasources.neoAPI.findDateRequests({ id });
    }), queue: ({ id: idParent, followerDisplay }, _, { datasources, user }) => __awaiter(this, void 0, void 0, function* () {
        const id = idParent || user.id;
        return yield datasources.neoAPI.getUserQueue({ id, followerDisplay });
    }), matchedDates: ({ id: idParent }, _, { datasources, user }) => __awaiter(this, void 0, void 0, function* () {
        const id = idParent || user.id;
        return yield datasources.neoAPI.getMatchedDates({ id });
    }) });
//# sourceMappingURL=User.js.map