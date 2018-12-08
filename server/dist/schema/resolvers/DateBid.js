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
exports.DateBid = Object.assign({}, generated_1.DateBidResolvers.defaultResolvers, { dateUser: ({ id }, _, { dataSources }) => __awaiter(this, void 0, void 0, function* () { return yield dataSources.neoAPI.getDateCreator({ id }); }), bidUser: ({ id }, _, { dataSources }) => __awaiter(this, void 0, void 0, function* () { return yield dataSources.neoAPI.findDateBidder({ id }); }), date: ({ id }, _, { dataSources }) => __awaiter(this, void 0, void 0, function* () { return yield dataSources.neoAPI.findDateFromBid({ id }); }) });
//# sourceMappingURL=DateBid.js.map