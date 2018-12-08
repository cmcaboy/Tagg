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
const firestore_1 = require("../db/firestore");
const neo4j_1 = require("../db/neo4j");
const pushMessageFormat_1 = require("../services/pushMessageFormat");
const session = neo4j_1.driver.session();
exports.chooseWinnerPushWinner = ({ id, datetimeOfDate, creator, winner, }) => __awaiter(this, void 0, void 0, function* () {
    if (!winner.sendNotifications) {
        console.log(`User ${winner.id} does not currently have notifications turned on.`);
        return null;
    }
    const message = {
        notification: {
            title: pushMessageFormat_1.chooseWinnerPushWinnerTitle(creator.name),
            body: pushMessageFormat_1.chooseWinnerPushWinnerBody(creator.name, datetimeOfDate),
        },
        apns: {
            payload: {
                aps: {
                    'content-available': 1,
                    badge: 1,
                },
            },
        },
        token: winner.token,
        data: {
            type: 'CHOOSE_WINNER_WINNER',
            matchId: id,
            id: winner.id,
            name: winner.name,
            pic: winner.pics ? winner.pics[0] : '',
            otherId: creator.id,
            otherName: creator.name,
            otherPic: creator.pics ? creator.pics[0] : '',
        },
    };
    return firestore_1.messaging
        .send(message)
        .then((response) => console.log(`Push Notification Sent to ${winner.id}: `, response))
        .catch((e) => console.log(`Error sending push notification to ${winner.id}: `, e));
});
exports.chooseWinnerPushLoser = ({ id, creator, datetimeOfDate, }) => __awaiter(this, void 0, void 0, function* () {
    let list;
    try {
        const result = yield session.run(`MATCH (a:User)-[r:BID]->(d:Date{id:'${id}'})
        RETURN a.token, a.id, a.sendNotifications`);
        list = result.records;
    }
    catch (e) {
        console.log(`Error getting list of date losers for ${creator.id}: ${e}`);
        return null;
    }
    return list
        .filter(record => !record._fields[2])
        .forEach((record) => {
        let token;
        let loserId;
        let sendNotifications;
        try {
            token = record._fields[0];
            loserId = record._fields[1];
            sendNotifications = record._fields[2];
        }
        catch (e) {
            console.log(`error parsing token for ${creator.id}: ${e}`);
        }
        if (!sendNotifications) {
            console.log(`User ${loserId} does not currently have notifications turned on.`);
            return null;
        }
        const message = {
            notification: {
                title: pushMessageFormat_1.chooseWinnerPushLoserTitle(creator.name),
                body: pushMessageFormat_1.chooseWinnerPushLoserBody(creator.name, datetimeOfDate),
            },
            apns: {
                payload: {
                    aps: {
                        'content-available': 1,
                        badge: 1,
                    },
                },
            },
            token,
            data: {
                type: 'CHOOSE_WINNER_LOSER',
            },
        };
        console.log('message: ', message);
        return firestore_1.messaging
            .send(message)
            .then((response) => console.log(`Push Notification Sent to ${loserId}: `, response))
            .catch((e) => console.log(`Error sending push notification to ${loserId}: `, e));
    });
});
//# sourceMappingURL=chooseWinnerPush.js.map