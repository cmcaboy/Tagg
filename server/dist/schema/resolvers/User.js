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
exports.User = Object.assign({}, generated_1.UserResolvers.defaultResolvers, { hasDateOpen: ({ id }, _, { datasources }) => __awaiter(this, void 0, void 0, function* () {
        return yield datasources.neoAPI.userHasDateOpen({ id });
    }), distanceApart: ({ id, hostId, distanceApart }, _, { datasources }) => __awaiter(this, void 0, void 0, function* () {
        return yield datasources.neoAPI.userDistanceApart({
            id,
            hostId,
            distanceApart
        });
    }), isFollowing: ({ id, hostId, isFollowing }, _, { datasources }) => __awaiter(this, void 0, void 0, function* () {
        return yield datasources.neoAPI.userIsFollowing({
            id,
            hostId,
            isFollowing
        });
    }), following: ({ id, hostId, isFollowing }, _, { datasources }) => __awaiter(this, void 0, void 0, function* () {
        return yield datasources.neoAPI.getFollowersFromUser({
            id,
            hostId,
            isFollowing
        });
    }), bids: ({ id }, _, { datasources }) => __awaiter(this, void 0, void 0, function* () {
        return yield datasources.neoAPI.findBidsFromUser({ id });
    }), dateRequests: ({ id }, _, { datasources }) => __awaiter(this, void 0, void 0, function* () {
        return yield datasources.neoAPI.findDateRequests({ id });
    }), queue: ({ id, followerDisplay }, _, { datasources }) => __awaiter(this, void 0, void 0, function* () {
        return yield datasources.neoAPI.getUserQueue({ id, followerDisplay });
    }), matchedDates: ({ id }, _, { datasources }) => __awaiter(this, void 0, void 0, function* () {
        return yield datasources.neoAPI.getMatchedDates({ id });
    }) });
//# sourceMappingURL=User.js.map