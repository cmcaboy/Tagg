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
const variables_1 = require("../resolvers/variables");
const format_1 = require("../../middleware/format");
const { DataSource } = require('apollo-datasource');
class FirestoreAPI extends DataSource {
    constructor({ db }) {
        super();
        this.getMessages = ({ id }) => __awaiter(this, void 0, void 0, function* () {
            const query = this.db
                .collection(`matches/${id}/messages`)
                .orderBy('order')
                .limit(variables_1.MESSAGE_PAGE_LENGTH);
            let data;
            try {
                data = yield query.get();
            }
            catch (e) {
                console.log('error fetching more messages from firestore: ', e);
                return {
                    id,
                    list: [],
                    cursor: null,
                };
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
                    _id: docData._id,
                };
            });
            if (messages.length === 0) {
                return {
                    id,
                    list: [],
                    cursor: null,
                };
            }
            const cursor = messages.length >= variables_1.MESSAGE_PAGE_LENGTH ? messages[messages.length - 1].order : null;
            return {
                id,
                list: messages,
                cursor,
            };
        });
        this.getMessagesMatch = ({ id, matchId }) => __awaiter(this, void 0, void 0, function* () {
            if (!matchId) {
                return {
                    id,
                    list: [],
                    cursor: null,
                };
            }
            const data = yield this.db
                .collection(`matches/${matchId}/messages`)
                .orderBy('createdAt', 'desc')
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
                    _id: docData._id,
                };
            });
            const cursor = messages.length > 0 ? messages[messages.length - 1].order : null;
            return {
                id,
                cursor,
                list: messages,
            };
        });
        this.getLastMessage = ({ matchId }) => __awaiter(this, void 0, void 0, function* () {
            if (!matchId) {
                return null;
            }
            try {
                const data = yield this.db
                    .collection(`matches/${matchId}/messages`)
                    .orderBy('createdAt', 'desc')
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
                        _id: docData._id,
                    };
                });
                return messages[0];
            }
            catch (e) {
                console.log('error fetching last message: ', e);
                return null;
            }
        });
        this.getMoreMessages = ({ id, cursor: cursorArg }) => __awaiter(this, void 0, void 0, function* () {
            if (!cursorArg) {
                return {
                    id,
                    list: [],
                    cursor: null,
                };
            }
            const cursor = parseInt(cursorArg);
            const query = this.db
                .collection(`matches/${id}/messages`)
                .orderBy('order')
                .startAfter(cursor)
                .limit(variables_1.MESSAGE_PAGE_LENGTH);
            let data;
            try {
                data = yield query.get();
            }
            catch (e) {
                console.log('error fetching more messages from firestore: ', e);
                return {
                    id,
                    list: [],
                    cursor,
                };
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
                    _id: docData._id,
                };
            });
            if (messages.length === 0) {
                return {
                    id,
                    list: [],
                    cursor,
                };
            }
            const newCursor = messages.length >= variables_1.MESSAGE_PAGE_LENGTH ? messages[messages.length - 1].order : null;
            return {
                id,
                list: messages,
                cursor: newCursor,
            };
        });
        this.createMessage = ({ matchId, message }) => __awaiter(this, void 0, void 0, function* () {
            console.log('createMessage message: ', message);
            try {
                yield this.db.collection(`matches/${matchId}/messages`).add(message);
                return true;
            }
            catch (e) {
                console.error(`error writing new message to ${matchId}: ${e}`);
                return null;
            }
        });
        this.createDateChat = ({ id, winnerId, dateId, date, }) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.db
                    .collection('matches')
                    .doc(dateId)
                    .set({
                    user1: id,
                    user2: winnerId,
                    matchTime: format_1.getCurrentDateFirestore(),
                    datetimeOfDate: date.datetimeOfDate,
                    description: date.description,
                });
            }
            catch (e) {
                console.error(`chooseWinner error updating Firestore: ${e}`);
                return null;
            }
            return true;
        });
        this.removeMatch = (matchId) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.db
                    .collection('matches')
                    .doc(matchId)
                    .delete();
            }
            catch (e) {
                console.log(`Could not remove match ${matchId}`);
                return false;
            }
            console.log(`match ${matchId} removed from Firestore`);
            return true;
        });
        this.db = db;
    }
    initialize(config) {
        this.context = config.context;
    }
}
exports.default = FirestoreAPI;
//# sourceMappingURL=firestore.js.map