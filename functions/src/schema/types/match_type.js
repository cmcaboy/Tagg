"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
var message_type_1 = require("./message_type");
var user_type_1 = require("./user_type");
var firestore_1 = require("../../db/firestore");
var MatchType = new graphql_1.GraphQLObjectType({
    name: 'MatchType',
    fields: function () { return ({
        matchId: { type: graphql_1.GraphQLString },
        user: { type: user_type_1.UserType },
        messages: {
            type: new graphql_1.GraphQLList(message_type_1.MessageType),
            resolve: function (parentValue, _) {
                return __awaiter(this, void 0, void 0, function () {
                    var data;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!parentValue.matchId) {
                                    return [2 /*return*/, []];
                                }
                                return [4 /*yield*/, firestore_1.db.collection("matches/" + parentValue.matchId + "/messages").orderBy("date", "desc").limit(50).get()];
                            case 1:
                                data = _a.sent();
                                return [2 /*return*/, data.docs.map(function (doc) {
                                        var docData = doc.data();
                                        return {
                                            id: docData.id,
                                            name: docData.name,
                                            date: docData.date,
                                            message: docData.message
                                        };
                                    })];
                        }
                    });
                });
            }
        },
        lastMessage: {
            type: message_type_1.MessageType,
            resolve: function (parentValue, _) {
                return __awaiter(this, void 0, void 0, function () {
                    var data, messages, e_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!parentValue.matchId) {
                                    return [2 /*return*/, null];
                                }
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, firestore_1.db.collection("matches/" + parentValue.matchId + "/messages").orderBy("date", "desc").limit(1).get()];
                            case 2:
                                data = _a.sent();
                                if (!data.docs) {
                                    return [2 /*return*/, null];
                                }
                                messages = data.docs.map(function (doc) {
                                    var docData = doc.data();
                                    return {
                                        id: docData.id,
                                        name: docData.name,
                                        date: docData.date,
                                        message: docData.message
                                    };
                                });
                                // This array should only have 1 element, but I want to return just the element rather than a 1 length array.
                                return [2 /*return*/, messages[0]];
                            case 3:
                                e_1 = _a.sent();
                                console.log('error fetching last message: ', e_1);
                                return [2 /*return*/, null];
                            case 4: return [2 /*return*/];
                        }
                    });
                });
            }
        }
    }); }
});
exports.MatchType = MatchType;
