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
const firestore_1 = require("../../db/firestore");
const neo4j_1 = require("../../db/neo4j");
const variables_1 = require("./variables");
const session = neo4j_1.driver.session();
exports.Match = Object.assign({}, generated_1.MatchResolvers.defaultResolvers, { user: (parentValue, _) => {
        return session
            .run(`MATCH(a:User)-[:CREATE]->(d:Date{id:'${parentValue.id}'}) RETURN a`)
            .then((result) => result.records[0])
            .then((record) => record._fields[0].properties)
            .catch((e) => console.log("winner error: ", e));
    }, messages: (parentValue, args) => __awaiter(this, void 0, void 0, function* () {
        console.log("messages resolver");
        console.log("parentValue.matchId: ", parentValue.matchId);
        console.log("args: ", args);
        if (!parentValue.matchId) {
            return {
                id: parentValue.id,
                list: [],
                cursor: null
            };
        }
        const data = yield firestore_1.db
            .collection(`matches/${parentValue.matchId}/messages`)
            .orderBy("createdAt", "desc")
            .limit(variables_1.MESSAGE_PAGE_LENGTH)
            .get();
        const messages = data.docs.map((doc) => {
            const docData = doc.data();
            return {
                name: docData.name,
                avatar: docData.avatar,
                uid: docData.uid,
                text: docData.text,
                createdAt: docData.createdAt,
                order: docData.order,
                _id: docData._id
            };
        });
        const cursor = messages.length > 0 ? messages[messages.length - 1].order : null;
        console.log("messages in messages: ", messages);
        return {
            id: parentValue.id,
            cursor,
            list: messages
        };
    }), lastMessage: (parentValue, args) => __awaiter(this, void 0, void 0, function* () {
        console.log("lastMessage resolver");
        console.log("parentValue.matchId: ", parentValue.matchId);
        console.log("args: ", args);
        if (!parentValue.matchId) {
            return null;
        }
        try {
            const data = yield firestore_1.db
                .collection(`matches/${parentValue.matchId}/messages`)
                .orderBy("createdAt", "desc")
                .limit(1)
                .get();
            if (!data.docs) {
                return null;
            }
            const messages = data.docs.map((doc) => {
                const docData = doc.data();
                return {
                    name: docData.name,
                    avatar: docData.avatar,
                    uid: docData.uid,
                    text: docData.text,
                    createdAt: docData.createdAt,
                    order: docData.order,
                    _id: docData._id
                };
            });
            return messages[0];
        }
        catch (e) {
            console.log("error fetching last message: ", e);
            return null;
        }
    }) });
//# sourceMappingURL=Match.js.map