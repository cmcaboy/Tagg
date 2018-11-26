import gql from 'graphql-tag';

export const GET_ID = gql`
  query getId {
    user @client {
      id
    }
  }
`;
