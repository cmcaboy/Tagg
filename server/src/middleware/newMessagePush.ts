// Send a push notification to each user who bid on the date
// Send a congrats message to the winner
// send a failure message to all the others

import { messaging } from "../db/firestore";
import { driver } from "../db/neo4j";
import {
  newMessagePushTitle,
  newMessagePushBody
} from "../services/pushMessageFormat";
import { PushMessage } from "../types/PushMessage";

const session = driver.session();

export const newMessagePush = async ({
  matchId,
  otherId,
  otherName,
  otherPic,
  text,
  id
}: {
  matchId: string;
  otherId: string | null;
  otherName: string | null;
  otherPic: string | null;
  text: string | null;
  id: string | null;
}): Promise<string | null> => {
  // This function sends a push notification to all of the date creator's followers
  let name!: string;
  let pics!: string[];
  let token!: string;
  let sendNotifications!: boolean;
  // Grab the receiver's token, name, and avatar (pic)
  try {
    const result: any = await session.run(
      `MATCH (a:User{id: '${id}'}) RETURN a.name, a.pics, a.token, a.sendNotifications`
    );
    name = result.records[0]._fields[0];
    pics = result.records[0]._fields[1];
    token = result.records[0]._fields[2];
    sendNotifications = result.records[0]._fields[3];
  } catch (e) {
    console.log(
      `Error building newMessage push notification to ${id} from ${otherId}: ${e}`
    );
    return null;
  }

  // Check to see if follower has notifications turned off.
  if (!sendNotifications) {
    console.log(`User ${id} does not currently have notifications turned on.`);
    return null;
  }

  // Create the message for the winner
  const message: PushMessage = {
    notification: {
      // notification content
      title: newMessagePushTitle(name),
      body: newMessagePushBody(text)
    },
    token, // token identifies the user/device to send the mssage to
    apns: {
      payload: {
        aps: {
          "content-available": 1,
          badge: 1
        }
      }
    },
    data: {
      // Data payload that can be used to act on the notification
      // Let's make a payload that navigates the user to Messenger screen for the creator
      type: `NEW_MESSAGE`,
      matchId,
      id,
      name,
      pic: !!pics ? pics[0] : "",
      otherId,
      otherName,
      otherPic
    }
  };

  console.log("message: ", message);
  // Send the message using the Firebase Admin SDK messaging module
  return messaging
    .send(message)
    .then((response: string) =>
      console.log(
        `newMessage push notification sent to ${id} from ${otherId}: ${response}`
      )
    )
    .catch((e: string) =>
      console.log(
        `Error sending newMessage push notification to ${id} from ${otherId}: ${e}`
      )
    );
};
