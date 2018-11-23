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
exports.DateItem = Object.assign({}, generated_1.DateItemResolvers.defaultResolvers, { creator: ({ id }, _, { datasources }) => __awaiter(this, void 0, void 0, function* () {
        return yield datasources.neoAPI.findCreatorFromDate({ id });
    }), num_bids: ({ id }, _, { datasources }) => __awaiter(this, void 0, void 0, function* () {
        return yield datasources.neoAPI.findNumberOfBidsFromDate({ id });
    }), winner: ({ id }, _, { datasources }) => __awaiter(this, void 0, void 0, function* () {
        return yield datasources.neoAPI.findDateWinner({ id });
    }), bids: ({ id }, _, { datasources }) => __awaiter(this, void 0, void 0, function* () {
        return yield datasources.neoAPI.findBidsFromDate({ id });
    }) });
//# sourceMappingURL=DateItem.js.map