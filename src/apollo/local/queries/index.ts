import gql from 'graphql-tag';

export const GET_ID = gql`
  query getId {
    user @client {
      id
    }
  }
`;

export const GET_AGE_PREFERENCE_LOCAL = gql`
  query getAgePreferenceLocal {
    user @client {
      minAgePreference
      maxAgePreference
    }
  }
`;
export const GET_DISTANCE_LOCAL = gql`
  query getDistanceLocal {
    user @client {
      distance
    }
  }
`;
export const GET_NOTIFICATIONS_LOCAL = gql`
  query getNotificationsLocal {
    user @client {
      sendNotifications
    }
  }
`;
