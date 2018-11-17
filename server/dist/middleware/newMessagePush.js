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
exports.newMessagePush = ({ matchId, otherId, otherName, otherPic, text, id }) => __awaiter(this, void 0, void 0, function* () {
    // This function sends a push notification to all of the date creator's followers
    let name;
    let pics;
    let token;
    let sendNotifications;
    // Grab the receiver's token, name, and avatar (pic)
    try {
        const result = yield session.run(`MATCH (a:User{id: '${id}'}) RETURN a.name, a.pics, a.token, a.sendNotifications`);
        name = result.records[0]._fields[0];
        pics = result.records[0]._fields[1];
        token = result.records[0]._fields[2];
        sendNotifications = result.records[0]._fields[3];
    }
    catch (e) {
        console.log(`Error building newMessage push notification to ${id} from ${otherId}: ${e}`);
        return null;
    }
    // Check to see if follower has notifications turned off.
    if (!sendNotifications) {
        console.log(`User ${id} does not currently have notifications turned on.`);
        return null;
    }
    // Create the message for the winner
    const message = {
        notification: {
            title: pushMessageFormat_1.newMessagePushTitle(name),
            body: pushMessageFormat_1.newMessagePushBody(text),
        },
        token,
        apns: {
            payload: {
                aps: {
                    "content-available": 1,
                    "badge": 1,
                },
            },
        },
        data: {
            // Let's make a payload that navigates the user to Messenger screen for the creator
            type: `NEW_MESSAGE`,
            matchId,
            id,
            name,
            pic: !!pics ? pics[0] : '',
            otherId,
            otherName,
            otherPic,
        }
    };
    console.log('message: ', message);
    // Send the message using the Firebase Admin SDK messaging module
    firestore_1.messaging.send(message)
        .then((response) => console.log(`newMessage push notification sent to ${id} from ${otherId}: ${response}`))
        .catch(e => console.log(`Error sending newMessage push notification to ${id} from ${otherId}: ${e}`));
});
//# sourceMappingURL=newMessagePush.js.map