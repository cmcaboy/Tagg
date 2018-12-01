// import { resolvers } from '../index';
import { server } from '../../schema';
import {
  GET_QUEUE,
  GET_DATES,
  GET_BIDS,
  GET_USER_PROFILE,
  GET_MATCHES,
  GET_SETTINGS,
  GET_EDIT_PROFILE,
  CHECK_EMAIL,
} from '../../../../../src/apollo/queries/index';

const { createTestClient } = require('apollo-server-testing');

const { ApolloServer } = require('apollo-server-express');

const TEST_ID = 'cory.mcaboy@gmail.com';

describe('Query.user', () => {
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
  const { query } = createTestClient(testServer);

  it('GET_QUEUE no params', async () => {
    const res = await query({ query: GET_QUEUE });
    expect(res).toMatchSnapshot();
  });
  it(`GET_QUEUE id: ${TEST_ID}`, async () => {
    const res = await query({ query: GET_QUEUE, variables: { id: TEST_ID } });
    expect(res).toMatchSnapshot();
  });
  it(`GET_DATES id: ${TEST_ID}`, async () => {
    const res = await query({ query: GET_DATES, variables: { id: TEST_ID } });
    expect(res).toMatchSnapshot();
  });
  it('GET_DATES', async () => {
    const res = await query({ query: GET_DATES });
    expect(res).toMatchSnapshot();
  });
  it('GET_BIDS no params', async () => {
    const res = await query({ query: GET_BIDS });
    expect(res).toMatchSnapshot();
  });
  it(`GET_BIDS id: ${TEST_ID}`, async () => {
    const res = await query({ query: GET_BIDS, variables: { id: TEST_ID } });
    expect(res).toMatchSnapshot();
  });
  it('GET_USER_PROFILE no params', async () => {
    const res = await query({ query: GET_USER_PROFILE });
    expect(res).toMatchSnapshot();
  });
  it(`GET_USER_PROFILE id: ${TEST_ID}`, async () => {
    const res = await query({ query: GET_USER_PROFILE, variablesL: { id: TEST_ID } });
    expect(res).toMatchSnapshot();
  });
  it(`GET_MATCHES id: ${TEST_ID}`, async () => {
    const res = await query({ query: GET_MATCHES, variables: { id: TEST_ID } });
    expect(res).toMatchSnapshot();
  });
  it('GET_MATCHES no params', async () => {
    const res = await query({ query: GET_MATCHES });
    expect(res).toMatchSnapshot();
  });
  it('GET_SETTINGS no params', async () => {
    const res = await query({ query: GET_SETTINGS });
    expect(res).toMatchSnapshot();
  });
  it(`GET_SETTINGS id: ${TEST_ID}`, async () => {
    const res = await query({ query: GET_SETTINGS, variables: { id: TEST_ID } });
    expect(res).toMatchSnapshot();
  });
  it('GET_EDIT_PROFILE no params', async () => {
    const res = await query({ query: GET_EDIT_PROFILE });
    expect(res).toMatchSnapshot();
  });
  it(`GET_EDIT_PROFILE id: ${TEST_ID}`, async () => {
    const res = await query({ query: GET_SETTINGS, variables: { id: TEST_ID } });
    expect(res).toMatchSnapshot();
  });
  it(`CHECK_EMAIL id: ${TEST_ID}`, async () => {
    const res = await query({ query: CHECK_EMAIL, variables: { id: TEST_ID } });
    expect(res).toMatchSnapshot();
  });
  it('CHECK_EMAIL no params', async () => {
    const res = await query({ query: CHECK_EMAIL });
    expect(res).toMatchSnapshot();
  });
});

describe('Query.otherBids', () => {
  const testServer = new ApolloServer({
    ...server,
    context: () => ({
      user: {
        id: TEST_ID,
        email: TEST_ID,
      },
    }),
  });
  const { query } = createTestClient(testServer);

  it('GET_BIDS no params', async () => {
    const res = await query({ query: GET_BIDS });
    expect(res).toMatchSnapshot();
  });
  it(`GET_BIDS id: ${TEST_ID}`, async () => {
    const res = await query({ query: GET_BIDS, variables: { id: TEST_ID } });
    expect(res).toMatchSnapshot();
  });
});
