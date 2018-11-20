import gql from 'graphql-tag';

export const GET_ID = gql`
  query {
    user @client {
      id
    }
  }
`;
