// Send a push notification to each user who bid on the date
// Send a congrats message to the winner
// send a failure message to all the others

import {messaging} from '../db/firestore';
import {driver} from '../db/neo4j';
import {
    chooseWinnerPushWinnerTitle,
    chooseWinnerPushWinnerBody,
    chooseWinnerPushLoserTitle,
    chooseWinnerPushLoserBody,
} from '../services/pushMessageFormat';

const session = driver.session();

export const chooseWinnerPushWinner = async ({id,datetimeOfDate,creator,winner}) => {
    // This function sends a push notification to all of the date creator's followers
    
    // Create the message for the winner
    const message = {
        notification: { // notification content
            title: chooseWinnerPushWinnerTitle(creator.name),
            body: chooseWinnerPushWinnerBody(creator.name,datetimeOfDate),
        },
        token: winner.token, // token identifies the user/device to send the mssage to
        data: { // Data payload that can be used to act on the notification
            // Let's make a payload that navigates the user to Messenger screen for the creator
            type: `CHOOSE_WINNER_WINNER`,
            matchId: id,
            id: winner.id,
            name: winner.name,
            pic: !!winner.pics? winner.pics[0] : '',
            otherId: creator.id,
            otherName: creator.name,
            otherPic: !!creator.pics? creator.pics[0] : '',
        }
    }

    console.log('message: ',message);
    // Send the message using the Firebase Admin SDK messaging module
    messaging.send(message)
        .then((response) => console.log(`Push Notification Sent to ${winner.id}: `,response))
        .catch(e => console.log(`Error sending push notification to ${winner.id}: `,e))
}

export const chooseWinnerPushLoser = async ({id,creator,datetimeOfDate}) => {

    // Get list of losers
    let list;    

    try {
        const result = await session.run(`MATCH (a:User)-[r:BID]->(d:Date{id:'${id}'})
            RETURN a.token, a.id, r.winner`)
        list = result.records;
    } catch(e) {
        console.log(`Error getting list of date losers for ${creator.id}: ${e}`)
        return null
    }

    list.filter(record => !record._fields[2]).forEach(record => {
        let token;
        let loserId;
        try {
            token = record._fields[0];
            loserId = record._fields[1]; // Only used for debug logging
        } catch(e) {
            console.log(`error parsing token for ${creator.id}: ${e}`);
        }
        // Send them a message
        const message = {
            notification: { // notification content
                title: chooseWinnerPushLoserTitle(creator.name),
                body: chooseWinnerPushLoserTitle(creator.name,datetimeOfDate),
            },
            token, // token identifies the user/device to send the mssage to
            data: { // Data payload that can be used to act on the notification
            // Payload won't have much. No reason to navigate the user anywhere
                type: `CHOOSE_WINNER_LOSER`,
            }
        }

        console.log('message: ',message);
        // Send the message using the Firebase Admin SDK messaging module
        messaging.send(message)
            .then((response) => console.log(`Push Notification Sent to ${loserId}: `,response))
            .catch(e => console.log(`Error sending push notification to ${loserId}: `,e))

    })
    
    // Payload won't have much. No reason to navigate the user anywhere
}