import { MutationResolvers } from '../../types/generated';
import { getCurrentDateFirestore, getCurrentDateNeo } from '../../middleware/format';
import { pubsub } from '../../pubsub/index';
import { NEW_MESSAGE } from '../../pubsub/subscriptions';
import { newMessagePush } from '../../middleware/newMessagePush';
import { createDatePush } from '../../middleware/createDatePush';
import { chooseWinnerPushWinner, chooseWinnerPushLoser } from '../../middleware/chooseWinnerPush';

const uuid = require('node-uuid');

export const Mutation: MutationResolvers.Type = {
  ...MutationResolvers.defaultResolvers,
  editUser: async (_, args, { datasources }) => await datasources.neoAPI.setUser(args),
  editUserQueue: async (_, args, { datasources }) => await datasources.neoAPI.setUserQueue(args),
  newUser: async (_, tempArgs, { datasources }) => await datasources.neoAPI.createUser(tempArgs),
  newMessage: async (_, args, { datasoures }) => {
    const message = {
      _id: args._id,
      name: args.name,
      text: args.text,
      avatar: args.avatar,
      createdAt: getCurrentDateFirestore(),
      order: args.order,
      uid: args.uid,
    };

    // Call our subscription asynchronously so we don't slow down our client.
    const asyncFunc = async () => {
      pubsub.publish(NEW_MESSAGE, {
        newMessageSub: { message, matchId: args.matchId },
      });
      newMessagePush({
        matchId: args.matchId,
        otherId: args.uid,
        otherName: args.name,
        otherPic: args.avatar,
        text: args.text,
        id: args.receiverId,
      });
    };
    asyncFunc();

    const sendMessage = await datasoures.firestoreAPI.createMessage(args);
    if (!sendMessage) {
      return null;
    }
    console.log(`${args.name} posted message to matchId ${args.matchId}`);

    return message;
  },
  follow: async (_, { followId, isFollowing }, { datasources }) => await datasources.neoAPI.followUser({ followId, isFollowing }),
  unFollow: async (_, { unFollowId }, { datasources }) => await datasources.neoAPI.unFollowUser({ unFollowId }),
  bid: async (_, args, { datasources }) => {
    // Need to make sure client cannot input doublequote ("). It will break the query.
    const datetimeOfBid = getCurrentDateNeo();
    const bidId = uuid();

    return await datasources.neoAPI.createbid({
      ...args,
      bidId,
      datetimeOfBid,
    });
  },
  createDate: async (_, args, { datasources, user: { id } }) => {
    // Currently, I am only creating the node field, but I also need to create the :CREATE relationship

    const creationTime = getCurrentDateNeo();
    const dateId = uuid();

    const date = await datasources.neoAPI.createDate({
      ...args,
      creationTime,
      dateId,
    });

    // Push Notification for new date
    // -------------------------------
    // For each user following the creator, send out a push notification
    // createDatePush is an async function so execution will not wait for
    // push notifications to be sent out.
    createDatePush(id, date);
    return date;
  },
  chooseWinner: async (_, { winnerId, dateId }, { datasources, user: { id } }) => {
    // In order to create a winner, we need to set winner=true on the bid, set open to FALSE on the date
    // Then we need to create a new document in the Firestore database, which will store messages between the
    // two.

    const date = await datasources.neoAPI.createDateWinner({
      winnerId,
      dateId,
    });
    // Create new document in Firestore for match

    const firestoreCreation = await datasources.firestoreAPI.createDateChat({
      id,
      winnerId,
      dateId,
      date,
    });

    if (!firestoreCreation) {
      console.log(`Failed to create date ${dateId} in firestore!`);
    }

    chooseWinnerPushWinner(date);
    chooseWinnerPushLoser(date);
    return date;
  },
  flag: async (_, { flaggedId, block }, { datasources }) => await datasources.neoAPI.setFlagUser({ flaggedId, block }),
  block: async (_, { blockedId }, { datasources }) => await datasources.neoAPI.setUserBlock({ blockedId }),
};
