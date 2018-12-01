import { MESSAGE_PAGE_LENGTH } from '../resolvers/variables';
import { DateItem } from '../../types/DateItem';
import { getCurrentDateFirestore } from '../../middleware/format';

const { DataSource } = require('apollo-datasource');

export default class FirestoreAPI extends (DataSource as { new (): any }) {
  constructor({ db }: { db: any }) {
    super();
    // console.log('firestore constructor');

    this.db = db;
  }

  initialize(config: any) {
    this.context = config.context;
  }

  getMessages = async ({ id }: { id: string }) => {
    const query: any = this.db
      .collection(`matches/${id}/messages`)
      .orderBy('order')
      .limit(MESSAGE_PAGE_LENGTH);

    let data!: any;
    try {
      data = await query.get();
    } catch (e) {
      console.log('error fetching more messages from firestore: ', e);
      return {
        id,
        list: [],
        cursor: null,
      };
    }

    const messages = data.docs.map((doc: any) => {
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

    // If there are no additional messages left, return an empty message array and
    // don't change the cursor
    if (messages.length === 0) {
      return {
        id,
        list: [],
        cursor: null,
      };
    }

    // Set the new cursor to the last date in the message array
    // Return a null cursor if the message array length is less than 20, indicating that their
    // are no more messages left to retreive.
    const cursor: number | null = messages.length >= MESSAGE_PAGE_LENGTH ? messages[messages.length - 1].order : null;

    // console.log('messages in moreMessages: ', messages);
    // console.log('newCursor: ', cursor);

    return {
      id,
      list: messages,
      cursor,
    };
  };

  getMessagesMatch = async ({ id, matchId }: { id: string; matchId: string | null }) => {
    if (!matchId) {
      return {
        id,
        list: [],
        cursor: null,
      };
    }
    const data = await this.db
      .collection(`matches/${matchId}/messages`)
      .orderBy('createdAt', 'desc')
      .limit(MESSAGE_PAGE_LENGTH)
      .get();

    const messages = data.docs.map((doc: any) => {
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

    // console.log('messages in messages: ', messages);

    return {
      id,
      cursor,
      list: messages,
    };
  };

  getLastMessage = async ({ matchId }: { matchId: string }) => {
    if (!matchId) {
      return null;
    }

    try {
      // Can use a desc option if orderBy if I need to get opposite order.
      // citiesRef.orderBy("state").orderBy("population", "desc")
      const data = await this.db
        .collection(`matches/${matchId}/messages`)
        .orderBy('createdAt', 'desc')
        .limit(1)
        .get();

      if (!data.docs) {
        return null;
      }

      const messages = data.docs.map((doc: any) => {
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

      // This array should only have 1 element, but I want to return just the element rather than a 1 length array.
      return messages[0];
    } catch (e) {
      console.log('error fetching last message: ', e);
      return null;
    }
  };

  getMoreMessages = async ({ id, cursor: cursorArg }: { id: string; cursor: string | null }) => {
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
      .limit(MESSAGE_PAGE_LENGTH);

    let data;
    try {
      data = await query.get();
    } catch (e) {
      console.log('error fetching more messages from firestore: ', e);
      return {
        id,
        list: [],
        cursor,
      };
    }

    const messages = data.docs.map((doc: any) => {
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

    // If there are no additional messages left, return an empty message array and
    // don't change the cursor
    if (messages.length === 0) {
      return {
        id,
        list: [],
        cursor,
      };
    }

    // Set the new cursor to the last date in the message array
    // Return a null cursor if the message array length is less than 20, indicating that their
    // are no more messages left to retreive.
    const newCursor: number | null = messages.length >= MESSAGE_PAGE_LENGTH ? messages[messages.length - 1].order : null;

    // console.log('messages in moreMessages: ', messages);
    // console.log('newCursor: ', newCursor);

    return {
      id,
      list: messages,
      cursor: newCursor,
    };
  };

  createMessage = async ({ matchId, message }: { matchId: string; message: any }) => {
    console.log('createMessage message: ', message);
    try {
      await this.db.collection(`matches/${matchId}/messages`).add(message);
      return true;
    } catch (e) {
      console.error(`error writing new message to ${matchId}: ${e}`);
      return null;
    }
  };

  createDateChat = async ({
    id,
    winnerId,
    dateId,
    date,
  }: {
  id: string;
  winnerId: string;
  dateId: string;
  date: DateItem;
  }) => {
    try {
      await this.db
        .collection('matches')
        .doc(dateId)
        .set({
          user1: id,
          user2: winnerId,
          matchTime: getCurrentDateFirestore(),
          datetimeOfDate: date.datetimeOfDate,
          description: date.description,
        });
    } catch (e) {
      console.error(`chooseWinner error updating Firestore: ${e}`);
      return null;
    }
    // If you make it to this point, the update was successful
    // return true
    return true;
  };
}
