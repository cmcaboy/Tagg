import gql from 'graphql-tag';

export const GET_NEW_MESSAGES = gql`
  subscription getNewMessages($matchId: String, $id: String) {
    newMessageSub(matchId: $matchId, id: $id) {
      name
      text
      createdAt
      avatar
      order
      uid
      _id
    }
  }
`;
