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
exports.createDatePush = (id, date) => __awaiter(this, void 0, void 0, function* () {
    let name;
    let list;
    let profilePic;
    try {
        const result = yield session.run(`MATCH (a:User{id:'${id}'}) return a.name, a.pics`);
        name = result.records[0]._fields[0];
        profilePic = !!result.records[0]._fields[1]
            ? result.records[0]._fields[1][0]
            : null;
    }
    catch (e) {
        console.log("createDate push notification - Failed to fetch token and name: ", e);
        return null;
    }
    try {
        const result = yield session.run(`MATCH (a:User)-[:FOLLOWING]->(b:User{id:'${id}'}) return a.token, a.id, a.sendNotifications`);
        list = result.records;
    }
    catch (e) {
        console.log("createDate push notification - Failed to get list of followers: ", e);
        return null;
    }
    return list.forEach((record) => {
        let token;
        let followerId;
        let sendNotifications;
        try {
            token = record._fields[0];
            followerId = record._fields[1];
            sendNotifications = record._fields[2];
        }
        catch (e) {
            console.log(`Error sending push notification to user: `, e);
            console.log(`record at fault: `, record);
            return null;
        }
        if (!sendNotifications) {
            console.log(`User ${followerId} does not currently have notifications turned on.`);
            return null;
        }
        const message = {
            notification: {
                title: pushMessageFormat_1.createDatePushTitle(name),
                body: pushMessageFormat_1.createDatePushBody(name, date.datetimeOfDate)
            },
            apns: {
                payload: {
                    aps: {
                        "content-available": 1,
                        badge: 1
                    }
                }
            },
            token,
            data: {
                id,
                type: `CREATE_DATE`,
                name,
                profilePic,
                description: date.description,
                dateId: date.id,
                datetimeOfDate: date.datetimeOfDate
            }
        };
        console.log("message: ", message);
        return firestore_1.messaging
            .send(message)
            .then((response) => console.log(`Push Notification Sent to ${followerId}: `, response))
            .catch((e) => console.log(`Error sending push notification to ${followerId}: `, e));
    });
});
//# sourceMappingURL=createDatePush.js.map