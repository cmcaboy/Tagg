import {messaging} from '../db/firestore';
import {driver} from '../db/neo4j';
import {createDatePushTitle,createDatePushBody} from '../services/pushMessageFormat';

const session = driver.session();

export const createDatePush = async (id,date) => {
    // This function sends a push notification to all of the date creator's followers
    
    let name;
    let list;
    let profilePic;

    // Grab the name of the date creator.
    try {
        const result = await session.run(`MATCH (a:User{id:'${id}'}) return a.name, a.pics`)
        name = result.records[0]._fields[0];
        profilePic = !!result.records[0]._fields[1]? result.records[0]._fields[1][0] : null;
    } catch(e) {
        console.log('createDate push notification - Failed to fetch token and name: ',e);
        return null;
    }

    // Grab each followers token and id. The id is only needed for debugging purposes. Only the
    // token is needed to send the message.
    try {
        const result = await session.run(`MATCH (a:User)-[:FOLLOWING]->(b:User{id:'${id}'}) return a.token, a.id, a.sendNotifications`)
        list = result.records;
    } catch(e) {
        console.log('createDate push notification - Failed to get list of followers: ',e);
        return null;
    } 

    // Loop through each follower
    return list.forEach(record => {
        let token;
        let followerId;
        let sendNotifications;
        try {
            token = record._fields[0];
            followerId = record._fields[1];
            sendNotifications = record._fields[2];
            
        } catch(e) {
            console.log(`Error sending push notification to user: `,e)
            console.log(`record at fault: `,record);
            return null;
        }

        // Check to see if follower has notifications turned off.
        if(!sendNotifications) {
          console.log(`User ${followerId} does not currently have notifications turned on.`);
          return null;
        }
        
        // Create the message for each user
        const message = {
            notification: { // notification content
                title: createDatePushTitle(name),
                body: createDatePushBody(name,date),
                content_available: true,
            },
            token, // token identifies the user/device to send the mssage to
            data: { // Data payload that can be used to act on the notification
                id,
                type: `CREATE_DATE`,
                name,
                profilePic,
                description: date.description,
                dateId: date.id,
                datetimeOfDate: date.datetimeOfDate, 
            }
        }

        console.log('message: ',message);
        // Send the message using the Firebase Admin SDK messaging module
        messaging.send(message)
            .then((response) => console.log(`Push Notification Sent to ${followerId}: `,response))
            .catch(e => console.log(`Error sending push notification to ${followerId}: `,e))
    })
}