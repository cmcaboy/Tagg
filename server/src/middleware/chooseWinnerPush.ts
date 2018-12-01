// Send a push notification to each user who bid on the date
// Send a congrats message to the winner
// send a failure message to all the others

import { messaging } from '../db/firestore';
import { driver } from '../db/neo4j';
import {
  chooseWinnerPushWinnerTitle,
  chooseWinnerPushWinnerBody,
  chooseWinnerPushLoserTitle,
  chooseWinnerPushLoserBody,
} from '../services/pushMessageFormat';
import { User } from '../types/User';
import { PushMessage } from '../types/PushMessage';

const session = driver.session();

export const chooseWinnerPushWinner = async ({
  id,
  datetimeOfDate,
  creator,
  winner,
}: {
id: string;
datetimeOfDate: string;
creator: User;
winner: User;
}): Promise<string | null> => {
  // This function sends a push notification to all of the date creator's followers

  // Check to see if follower has notifications turned off.
  if (!winner.sendNotifications) {
    console.log(`User ${winner.id} does not currently have notifications turned on.`);
    return null;
  }

  // Create the message for the winner
  const message: PushMessage = {
    notification: {
      // notification content
      title: chooseWinnerPushWinnerTitle(creator.name),
      body: chooseWinnerPushWinnerBody(creator.name, datetimeOfDate),
    },
    apns: {
      payload: {
        aps: {
          'content-available': 1,
          badge: 1,
        },
      },
    },
    token: winner.token, // token identifies the user/device to send the mssage to
    data: {
      // Data payload that can be used to act on the notification
      // Let's make a payload that navigates the user to Messenger screen for the creator
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

  // console.log("message: ", message);
  // Send the message using the Firebase Admin SDK messaging module
  return messaging
    .send(message)
    .then((response: Response) => console.log(`Push Notification Sent to ${winner.id}: `, response))
    .catch((e: string) => console.log(`Error sending push notification to ${winner.id}: `, e));
};

export const chooseWinnerPushLoser = async ({
  id,
  creator,
  datetimeOfDate,
}: {
id: string;
creator: User;
datetimeOfDate: string;
}): Promise<String | null | void> => {
  // Get list of losers
  let list: Array<any>;

  try {
    const result: any = await session.run(`MATCH (a:User)-[r:BID]->(d:Date{id:'${id}'})
        RETURN a.token, a.id, a.sendNotifications`);
    list = result.records;
  } catch (e) {
    console.log(`Error getting list of date losers for ${creator.id}: ${e}`);
    return null;
  }

  return list
    .filter(record => !record._fields[2])
    .forEach((record) => {
      let token!: string;
      let loserId!: string;
      let sendNotifications!: boolean;
      try {
        token = record._fields[0];
        loserId = record._fields[1]; // Only used for debug logging
        sendNotifications = record._fields[2];
      } catch (e) {
        console.log(`error parsing token for ${creator.id}: ${e}`);
      }

      // Check to see if follower has notifications turned off.
      if (!sendNotifications) {
        console.log(`User ${loserId} does not currently have notifications turned on.`);
        return null;
      }

      // Send them a message
      const message: PushMessage = {
        notification: {
          // notification content
          title: chooseWinnerPushLoserTitle(creator.name),
          body: chooseWinnerPushLoserBody(creator.name, datetimeOfDate),
        },
        apns: {
          payload: {
            aps: {
              'content-available': 1,
              badge: 1,
            },
          },
        },
        token, // token identifies the user/device to send the mssage to
        data: {
          // Data payload that can be used to act on the notification
          // Payload won't have much. No reason to navigate the user anywhere
          type: 'CHOOSE_WINNER_LOSER',
        },
      };

      console.log('message: ', message);
      // Send the message using the Firebase Admin SDK messaging module
      return messaging
        .send(message)
        .then((response: Response) => console.log(`Push Notification Sent to ${loserId}: `, response))
        .catch((e: string) => console.log(`Error sending push notification to ${loserId}: `, e));
    });
};
