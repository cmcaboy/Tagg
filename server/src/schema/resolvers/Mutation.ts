import { MutationResolvers } from '../../types/generated';
import { getCurrentDateFirestore, getCurrentDateNeo } from '../../middleware/format';
import { pubsub } from '../../pubsub/index';
import { NEW_MESSAGE } from '../../pubsub/subscriptions';
import { newMessagePush } from '../../middleware/newMessagePush';
import { createDatePush } from '../../middleware/createDatePush';
import { chooseWinnerPushWinner, chooseWinnerPushLoser } from '../../middleware/chooseWinnerPush';
import { auth } from '../../db/firestore';

const { AuthenticationError } = require('apollo-server');

const uuid = require('node-uuid');

export const Mutation: MutationResolvers.Type = {
  ...MutationResolvers.defaultResolvers,
  login: async (_, { email, password }, { dataSources }) => {
    // Check to make sure email exists
    const emailCheck = await dataSources.NeoAPI.findUser({ id: email });

    if (!emailCheck) {
      throw new AuthenticationError('User does not exist');
    }

    // Log user in via Firebase auth
    // I will call auth directly for now. If this works, move to its
    // own datasource
    try {
      await auth.signInWithEmailAndPassword(email, password);
    } catch (e) {
      throw new AuthenticationError(e);
    }

    // return user's email as token
    return emailCheck.email;
  },
  signup: async (_, { newUser, newUser: { email }, password }, { dataSources }) => {
    // Check to see if email already exists
    // if so, throw Authentication Error
    // I can use neo datasource
    const emailCheck = await dataSources.NeoAPI.findUser({ id: email });

    if (emailCheck) {
      throw new AuthenticationError('Whoops! Looks like this email has already been taken');
    }

    // Check to make sure user is not already registered with firebase auth
    // This command also signs the user in.
    // If so, throw Authentication Error
    // Firebase auth could use Firebase datasource
    try {
      await auth.createUserWithEmailAndPassword(email, password);
    } catch (e) {
      throw new AuthenticationError(e);
    }

    // Load new user in database
    // If operation fails, throw Authentication Error
    // Can use neo datasource
    try {
      await dataSources.NeoAPI.createUser(newUser);
    } catch (e) {
      throw new AuthenticationError(e);
    }

    // return user's email as token
    return email;
  },
  // facebookLogin = async (_, args, { dataSources }) => {},
  // facebookSignUp = async (_, args, { dataSources }) => {},
  editUser: async (_, args, { dataSources }) => await dataSources.neoAPI.setUser(args),
  removeUser: async (_, args, { dataSources }) => {
    // Get users's dateId's
    const { list: dateList } = await dataSources.neoAPI.getMatchedDates();
    // Remove user from neo db
    const user = await dataSources.neoAPI.removeUser(args);
    // Remove user's matched dates from firestore
    dateList.map(({ matchId }: { matchId: string }) => dataSources.firestoreAPI.removeMatch(matchId));
    // Return user object
    return user;
  },
  editUserQueue: async (_, args, { dataSources }) => await dataSources.neoAPI.setUserQueue(args),
  newUser: async (_, tempArgs, { dataSources }) => await dataSources.neoAPI.createUser(tempArgs),
  newMessage: async (_, args, { dataSources }) => {
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

    const sendMessage = await dataSources.firestoreAPI.createMessage({
      message,
      dateId: args.matchId,
    });
    if (!sendMessage) {
      return null;
    }
    // console.log(`${args.name} posted message to matchId ${args.matchId}`);

    return message;
  },
  follow: async (_, { followId, isFollowing }, { dataSources }) => await dataSources.neoAPI.followUser({ followId, isFollowing }),
  unFollow: async (_, { unFollowId }, { dataSources }) => await dataSources.neoAPI.unFollowUser({ unFollowId }),
  bid: async (_, args, { dataSources }) => {
    // Need to make sure client cannot input doublequote ("). It will break the query.
    const datetimeOfBid = getCurrentDateNeo();
    const bidId = uuid();

    return await dataSources.neoAPI.createBid({
      ...args,
      bidId,
      datetimeOfBid,
    });
  },
  createDate: async (_, args, { dataSources, user: { id } }) => {
    // Currently, I am only creating the node field, but I also need to create the :CREATE relationship

    const creationTime = getCurrentDateNeo();
    const dateId = uuid();

    const date = await dataSources.neoAPI.createDate({
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
  chooseWinner: async (
    _,
    { id: argsId, winnerId, dateId },
    { dataSources, user: { id: contextId } },
  ) => {
    // In order to create a winner, we need to set winner=true on the bid, set open to FALSE on the date
    // Then we need to create a new document in the Firestore database, which will store messages between the
    // two.

    const id = argsId || contextId || null;

    const date = await dataSources.neoAPI.createDateWinner({
      id,
      winnerId,
      dateId,
    });

    // Create new document in Firestore for match
    const firestoreCreation = await dataSources.firestoreAPI.createDateChat({
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
    // return date;
    return {
      id: dateId,
      winnerId,
      matchId: dateId,
      description: date.description,
      datetimeOfDate: date.datetimeOfDate,
    };
  },
  flag: async (_, { flaggedId, block }, { dataSources }) => await dataSources.neoAPI.setFlagUser({ flaggedId, block }),
  block: async (_, { blockedId }, { dataSources }) => await dataSources.neoAPI.setBlockUser({ blockedId }),
};
