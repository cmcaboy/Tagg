import gql from 'graphql-tag';

export const GET_ID = gql`
query {
    user @client {
        id
    }
}`

export const GET_AGE_PREFERENCE_LOCAL = gql`
query {
  user @client {
      minAgePreference
      maxAgePreference
  }
}
`;
export const GET_DISTANCE_LOCAL = gql`
query {
  user @client {
      distance
  }
}
`;
export const GET_NOTIFICATIONS_LOCAL = gql`
query {
  user @client {
      sendNotifications
  }
}
`;

