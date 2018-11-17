"use strict";
// Send a push notification to each user who bid on the date
// Send a congrats message to the winner
// send a failure message to all the others
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
exports.chooseWinnerPushWinner = ({ id, datetimeOfDate, creator, winner }) => __awaiter(this, void 0, void 0, function* () {
    // This function sends a push notification to all of the date creator's followers
    // Check to see if follower has notifications turned off.
    if (!winner.sendNotifications) {
        console.log(`User ${winner.id} does not currently have notifications turned on.`);
        return null;
    }
    // Create the message for the winner
    const message = {
        notification: {
            title: pushMessageFormat_1.chooseWinnerPushWinnerTitle(creator.name),
            body: pushMessageFormat_1.chooseWinnerPushWinnerBody(creator.name, datetimeOfDate),
        },
        apns: {
            payload: {
                aps: {
                    "content-available": 1,
                    "badge": 1,
                },
            },
        },
        token: winner.token,
        data: {
            // Let's make a payload that navigates the user to Messenger screen for the creator
            type: `CHOOSE_WINNER_WINNER`,
            matchId: id,
            id: winner.id,
            name: winner.name,
            pic: !!winner.pics ? winner.pics[0] : '',
            otherId: creator.id,
            otherName: creator.name,
            otherPic: !!creator.pics ? creator.pics[0] : '',
        }
    };
    console.log('message: ', message);
    // Send the message using the Firebase Admin SDK messaging module
    firestore_1.messaging.send(message)
        .then((response) => console.log(`Push Notification Sent to ${winner.id}: `, response))
        .catch(e => console.log(`Error sending push notification to ${winner.id}: `, e));
});
exports.chooseWinnerPushLoser = ({ id, creator, datetimeOfDate }) => __awaiter(this, void 0, void 0, function* () {
    // Get list of losers
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
    list.filter(record => !record._fields[2]).forEach(record => {
        let token;
        let loserId;
        let sendNotifications;
        try {
            token = record._fields[0];
            loserId = record._fields[1]; // Only used for debug logging
            sendNotifications = record._fields[2];
        }
        catch (e) {
            console.log(`error parsing token for ${creator.id}: ${e}`);
        }
        // Check to see if follower has notifications turned off.
        if (!sendNotifications) {
            console.log(`User ${loserId} does not currently have notifications turned on.`);
            return null;
        }
        // Send them a message
        const message = {
            notification: {
                title: pushMessageFormat_1.chooseWinnerPushLoserTitle(creator.name),
                body: pushMessageFormat_1.chooseWinnerPushLoserBody(creator.name, datetimeOfDate),
            },
            token,
            data: {
                // Payload won't have much. No reason to navigate the user anywhere
                type: `CHOOSE_WINNER_LOSER`,
            }
        };
        console.log('message: ', message);
        // Send the message using the Firebase Admin SDK messaging module
        firestore_1.messaging.send(message)
            .then((response) => console.log(`Push Notification Sent to ${loserId}: `, response))
            .catch(e => console.log(`Error sending push notification to ${loserId}: `, e));
    });
    // Payload won't have much. No reason to navigate the user anywhere
});
//# sourceMappingURL=chooseWinnerPush.js.map