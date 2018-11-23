// import { resolvers } from '../index';
import { server } from '../../schema';

const { createTestClient } = require('apollo-server-testing');

const { ApolloServer, gql } = require('apollo-server-express');

const BASIC_QUERY = gql`
  query user {
    id
    name
    work
  }
`;

describe('User query', () => {
  const testServer = new ApolloServer({
    ...server,
    context: {
      user: {
        id: 'cory.mcaboy@gmail.com',
        email: 'cory.mcaboy@gmail.com',
      },
    },
  });
  const { query } = createTestClient(testServer);
  it('Basic user query', async () => {
    const res = await query({ query: BASIC_QUERY });
    expect(res).toMatchSnapshot();
  });
});
