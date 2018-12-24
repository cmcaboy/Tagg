import { server } from '../../schema';
import { newUserDefaults } from '../../defaults';
import {
  NEW_USER,
  NEW_DATE,
  BID,
  SET_COORDS,
  CHOOSE_WINNER,
  SET_PUSH_TOKEN,
  FOLLOW,
  UNFOLLOW,
  SEND_MESSAGE,
  SET_AGE_PREFERENCE,
  REMOVE_USER,
  SET_DISTANCE,
  SET_NOTIFICATIONS,
  SET_FOLLOWER_DISPLAY,
  SET_NAME,
  SET_AGE,
  SET_WORK,
  SET_SCHOOL,
  SET_DESCRIPTION,
  SET_PICS,
  SET_EMAIL,
} from '../../../clientGQL/mutation';

const moment = require('moment');

const { createTestClient } = require('apollo-server-testing');

const { ApolloServer } = require('apollo-server-express');

const TEST_ID = 'cory.mcaboy@gmail.com';
let DATE_ID = '';

const TEST_MESSAGE = {
  name: 'Cory McAboy',
  text: 'Hey, how are you?',
  createdAt: '10/01/2019',
  avatar:
    'https://firebasestorage.googleapis.com/v0/b/manhattanmatch-9f9fe.appspot.com/o/0a7a7fdb-39d9-484d-9b24-80fa0ef66240?alt=media&token=a79482d1-44f5-46be-87a2-56bce9340b89',
  order: 189342789,
  uid: 'testUser@test.com',
  _id: '3429048jfksdjlk342',
};

const TEST_USER = {
  ...newUserDefaults,
  id: 'testuser@test.com',
  name: 'John Smith',
  email: 'testuser@test.com',
  token: '1234567890abc',
  pics: [
    'https://firebasestorage.googleapis.com/v0/b/manhattanmatch-9f9fe.appspot.com/o/0a7a7fdb-39d9-484d-9b24-80fa0ef66240?alt=media&token=a79482d1-44f5-46be-87a2-56bce9340b89',
    'https://firebasestorage.googleapis.com/v0/b/manhattanmatch-9f9fe.appspot.com/o/04f85f3e-63f5-4231-89dd-a45f94e96fa7?alt=media&token=6de58f19-1b2d-4041-8451-beff7287bf38',
    'https://firebasestorage.googleapis.com/v0/b/manhattanmatch-9f9fe.appspot.com/o/0522af5a-8f39-42b1-a1ca-6e7b3e5eaf87?alt=media&token=e9bfda10-0600-41d2-a848-35a19cc26ec8',
    'https://firebasestorage.googleapis.com/v0/b/manhattanmatch-9f9fe.appspot.com/o/0a7a7fdb-39d9-484d-9b24-80fa0ef66240?alt=media&token=a79482d1-44f5-46be-87a2-56bce9340b89',
    'https://firebasestorage.googleapis.com/v0/b/manhattanmatch-9f9fe.appspot.com/o/0415e065-c80c-44b5-b469-4c6370804423?alt=media&token=86cf1038-8d6e-425c-90ef-b80ee999d29b',
    'https://firebasestorage.googleapis.com/v0/b/manhattanmatch-9f9fe.appspot.com/o/0a7a7fdb-39d9-484d-9b24-80fa0ef66240?alt=media&token=a79482d1-44f5-46be-87a2-56bce9340b89',
  ],
};

describe('Mutation ', () => {
  const testServer = new ApolloServer({
    ...server,
    context: () => ({
      user: {
        id: TEST_ID,
        email: TEST_ID,
      },
    }),
    engine: null,
  });
  const { mutate } = createTestClient(testServer);

  it('NEW_USER', async () => {
    const res = await mutate({ mutation: NEW_USER, variables: { ...TEST_USER } });
    expect(res).toMatchSnapshot();
  });
  it('NEW_DATE', async () => {
    const datetimeOfDate = moment().unix() + 10000;
    const description = 'Looking for a walk of the beach';

    const res = await mutate({
      mutation: NEW_DATE,
      variables: {
        id: TEST_USER.id,
        datetimeOfDate,
        description,
      },
    });
    // console.log('NEW_DATE res: ', res);
    // take record of DATE_ID for future use
    // console.log('res: ', res);
    DATE_ID = res.data.createDate.id;
    expect(res.data.createDate).toMatchSnapshot({
      creationTime: expect.any(Number),
      datetimeOfDate: expect.any(Number),
      description,
      id: expect.any(String),
    });
    expect(res.data.createDate.datetimeOfDate).toEqual(datetimeOfDate);
    expect(res.data.createDate.description).toEqual(description);
    // console.log('DATE_ID NEW_DATE: ', res.data.createDate.id);
  });
  it('BID', async () => {
    const bidDescription = 'Looking for a walk of the beach';
    const bidPlace = 'Harrys pub';

    const res = await mutate({
      mutation: BID,
      variables: {
        id: TEST_ID,
        dateId: DATE_ID,
        bidPlace,
        bidDescription,
      },
    });
    expect(res.data.bid).toMatchSnapshot({
      bidDescription,
      bidPlace,
      date: {
        id: expect.any(String),
        num_bids: expect.any(Number),
      },
      datetimeOfBid: expect.any(Number),
      id: expect.any(String),
    });
  });
  it('SET_COORDS', async () => {
    const res = await mutate({
      mutation: SET_COORDS,
      variables: {
        id: TEST_USER.id,
        latitude: 85.0,
        longitude: -35.0,
      },
    });
    expect(res).toMatchSnapshot();
  });
  it('SET_PUSH_TOKEN', async () => {
    const res = await mutate({
      mutation: SET_PUSH_TOKEN,
      variables: {
        id: TEST_USER.id,
        token: '12345',
      },
    });
    expect(res).toMatchSnapshot();
  });
  it('CHOOSE_WINNER', async () => {
    const res = await mutate({
      mutation: CHOOSE_WINNER,
      variables: {
        id: TEST_USER.id,
        winnerId: TEST_ID,
        dateId: DATE_ID,
      },
    });
    expect(res.data.chooseWinner).toMatchSnapshot({
      id: expect.any(String),
      datetimeOfDate: expect.any(Number),
      matchId: expect.any(String),
      lastMessage: null,
      user: expect.any(Object),
    });
    expect(res.data.chooseWinner.matchId).toBe(DATE_ID);
    expect(res.data.chooseWinner.id).toBe(DATE_ID);
    expect(res.data.chooseWinner.user.id).toBe(TEST_ID);
  });
  it('FOLLOW', async () => {
    const res = await mutate({
      mutation: FOLLOW,
      variables: {
        id: TEST_USER.id,
        followId: TEST_ID,
        isFollowing: true,
      },
    });
    expect(res).toMatchSnapshot();
  });
  it('UNFOLLOW', async () => {
    const res = await mutate({
      mutation: UNFOLLOW,
      variables: {
        id: TEST_USER.id,
        unFollowId: TEST_ID,
      },
    });
    expect(res).toMatchSnapshot();
  });
  it('SEND_MESSAGE', async () => {
    const receiverId = 'cory.mcaboy@gmail.com';

    const res = await mutate({
      mutation: SEND_MESSAGE,
      variables: {
        id: TEST_USER.id,
        matchId: DATE_ID,
        ...TEST_MESSAGE,
        receiverId,
      },
    });
    expect(res.data.newMessage).toMatchSnapshot({
      ...TEST_MESSAGE,
      createdAt: expect.any(String),
    });
  });
  it('SET_AGE_PREFERENCE', async () => {
    const NEW_MIN_AGE_PREF = 24;
    const NEW_MAX_AGE_PREF = 28;

    const res = await mutate({
      mutation: SET_AGE_PREFERENCE,
      variables: {
        id: TEST_USER.id,
        minAgePreference: NEW_MIN_AGE_PREF,
        maxAgePreference: NEW_MAX_AGE_PREF,
      },
    });
    expect(res).toMatchSnapshot();
    expect(res.data.editUser.minAgePreference).toEqual(NEW_MIN_AGE_PREF);
    expect(res.data.editUser.maxAgePreference).toEqual(NEW_MAX_AGE_PREF);
  });
  // SET_DISTANCE
  it('SET_DISTANCE', async () => {
    const DISTANCE = 45;

    const res = await mutate({
      mutation: SET_DISTANCE,
      variables: {
        id: TEST_USER.id,
        distance: DISTANCE,
      },
    });
    expect(res).toMatchSnapshot();
    expect(res.data.editUser.distance).toEqual(DISTANCE);
  });
  // SET_NOTIFICATIONS
  it('SET_NOTIFICATIONS', async () => {
    const NOTIFICATIONS = true;

    const res = await mutate({
      mutation: SET_NOTIFICATIONS,
      variables: {
        id: TEST_USER.id,
        sendNotifications: NOTIFICATIONS,
      },
    });
    expect(res).toMatchSnapshot();
    expect(res.data.editUser.sendNotifications).toEqual(NOTIFICATIONS);
  });
  // SET_FOLLOWER_DISPLAY
  it('SET_FOLLOWER_DISPLAY', async () => {
    const FOLLOWER_DISPLAY_BOTH = 'Both';

    const res = await mutate({
      mutation: SET_FOLLOWER_DISPLAY,
      variables: {
        id: TEST_USER.id,
        followerDisplay: FOLLOWER_DISPLAY_BOTH,
      },
    });
    expect(res).toMatchSnapshot();
    expect(res.data.editUser.followerDisplay).toEqual(FOLLOWER_DISPLAY_BOTH);
  });
  // SET_NAME
  it('SET_NAME', async () => {
    const NEW_NAME = 'Michael Smith';

    const res = await mutate({
      mutation: SET_NAME,
      variables: {
        id: TEST_USER.id,
        name: NEW_NAME,
      },
    });
    expect(res).toMatchSnapshot();
    expect(res.data.editUser.name).toEqual(NEW_NAME);
  });
  // SET_AGE
  it('SET_AGE', async () => {
    const NEW_AGE = 33;

    const res = await mutate({
      mutation: SET_AGE,
      variables: {
        id: TEST_USER.id,
        age: NEW_AGE,
      },
    });
    expect(res).toMatchSnapshot();
    expect(res.data.editUser.age).toEqual(NEW_AGE);
  });
  // SET_WORK
  it('SET_WORK', async () => {
    const NEW_WORK = 'Poppa Johns';

    const res = await mutate({
      mutation: SET_WORK,
      variables: {
        id: TEST_USER.id,
        work: NEW_WORK,
      },
    });
    expect(res).toMatchSnapshot();
    expect(res.data.editUser.work).toEqual(NEW_WORK);
  });
  // SET_SCHOOL
  it('SET_SCHOOL', async () => {
    const NEW_SCHOOL = 'Shawnee High School';

    const res = await mutate({
      mutation: SET_SCHOOL,
      variables: {
        id: TEST_USER.id,
        school: NEW_SCHOOL,
      },
    });
    expect(res).toMatchSnapshot();
    expect(res.data.editUser.school).toEqual(NEW_SCHOOL);
  });
  // SET_DESCRIPTION
  it('SET_DESCRIPTION', async () => {
    const NEW_DESCRIPTION = 'Looking for something special';

    const res = await mutate({
      mutation: SET_DESCRIPTION,
      variables: {
        id: TEST_USER.id,
        description: NEW_DESCRIPTION,
      },
    });
    expect(res).toMatchSnapshot();
    expect(res.data.editUser.description).toEqual(NEW_DESCRIPTION);
  });
  // SET_PICS
  it('SET_PICS', async () => {
    const NEW_PICS = [
      'https://firebasestorage.googleapis.com/v0/b/manhattanmatch-9f9fe.appspot.com/o/0a7a7fdb-39d9-484d-9b24-80fa0ef66240?alt=media&token=a79482d1-44f5-46be-87a2-56bce9340b89',
    ];

    const res = await mutate({
      mutation: SET_PICS,
      variables: {
        id: TEST_USER.id,
        pics: NEW_PICS,
      },
    });
    expect(res).toMatchSnapshot();
    expect(res.data.editUser.pics).toEqual(NEW_PICS);
  });
  // SET_EMAIL
  it('SET_EMAIL', async () => {
    const NEW_EMAIL = 'test2@test.com';

    const res = await mutate({
      mutation: SET_EMAIL,
      variables: {
        id: TEST_USER.id,
        email: NEW_EMAIL,
      },
    });
    expect(res.data.editUser.email).toEqual(NEW_EMAIL);
    expect(res).toMatchSnapshot();
    const reset = await mutate({
      mutation: SET_EMAIL,
      variables: {
        id: TEST_USER.id,
        email: TEST_USER.email,
      },
    });
    expect(reset.data.editUser.email).toEqual(TEST_USER.email);
  });

  it('REMOVE_USER', async () => {
    const res = await mutate({
      mutation: REMOVE_USER,
      variables: {
        id: TEST_USER.id,
      },
    });
    expect(res).toMatchSnapshot();
    expect(res.data.removeUser.id).toEqual(TEST_USER.id);
  });
});
