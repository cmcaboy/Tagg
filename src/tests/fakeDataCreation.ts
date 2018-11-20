import faker from 'faker';
import { getCurrentTime, convertDateToEpoch } from '../format';

const TEST_CASE_SIZE = 100;

const rand = r => Math.round(Math.random() * r);
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export default async ({
  newUser, follow, bid, createDate, chooseWinner,
}) => {
  // Generate fake user data
  const users = [];
  for (let i = 0; i < TEST_CASE_SIZE; i += 1) {
    const user = {
      id: faker.internet.email(),
      name: faker.name.findName(),
      active: 1,
      email: faker.internet.email(),
      gender: Math.round(Math.random() * 2) % 2 === 0 ? 'male' : 'female',
      description: faker.random.words(10),
      school: faker.company.companyName(),
      work: faker.company.companyName(),
      sendNotifications: faker.random.boolean(),
      distance: Math.round(Math.random() * 50) + 1,
      token: faker.random.alphaNumeric(),
      latitude: Math.random() * 2 + 39.0,
      longitude: Math.random() * -2 + -74.0,
      minAgePreference: Math.round(Math.random() * 6) + 18,
      maxAgePreference: Math.round(Math.random() * 6) + 25,
      pics: [
        faker.image.avatar(),
        faker.image.avatar(),
        faker.image.avatar(),
        faker.image.avatar(),
        faker.image.avatar(),
        faker.image.avatar(),
      ],
      registerDateTime: getCurrentTime(),
    };
    users.push(user);
  }
  const dates = [];
  const bids = [];

  // Create new users
  users.forEach((u) => {
    newUser({
      variables: {
        ...u,
      },
    });
  });

  await sleep(10000);
  // Create fake follow relationships
  users.forEach((u) => {
    for (let i = 0; i < TEST_CASE_SIZE / 10; i += 1) {
      follow({
        variables: {
          id: u.id,
          followId: users[i * 10].id,
          isFollowing: true,
        },
      });
    }
  });

  await sleep(10000);

  // Create fake dates
  users.forEach(async (u) => {
    for (let k = 0; k < Math.round(Math.random() * 5); k += 1) {
      await sleep(1);
      createDate({
        variables: {
          id: u.id,
          datetimeOfDate: convertDateToEpoch(faker.date.future(14)),
          description: faker.random.words(5),
        },
        update: (store, data) => {
          dates.push({
            ...data.data.createDate,
            creator: u.id,
          });
        },
      });
    }
  });

  await sleep(10000);

  // Create fake bids
  dates.forEach(async (d) => {
    for (let k = rand(10); k < TEST_CASE_SIZE; k += rand(10)) {
      await sleep(1);
      bid({
        variables: {
          id: users[k].id,
          dateId: d.id,
          bidPlace: faker.random.words(2),
          bidDescription: faker.random.words(10),
        },
        update: (store, data) => {
          bids.push({
            ...data.data.bid,
            bidder: users[k].id,
          });
        },
      });
    }
  });

  await sleep(10000);
  console.log('dates: ', dates);
  console.log('bids: ', bids);
  console.log('users: ', users);

  // Create winners of dates
  dates.forEach((d) => {
    let winnerId;
    try {
      winnerId = bids.filter(b => b.date && b.date.id === d.id)[0].bidder;
    } catch (e) {
      return;
    }
    // Only choose winners for approximately half of the dates
    if (rand(100) % 2 === 0) {
      return;
    }
    console.log('id: ', d.creator);
    console.log('winnerId: ', winnerId);
    console.log('dateId: ', d.id);
    chooseWinner({
      variables: {
        id: d.creator,
        winnerId,
        dateId: d.id,
      },
    });
  });
};
