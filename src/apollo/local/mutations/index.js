import gql from 'graphql-tag';

export const SET_ID_LOCAL = gql`
  mutation updateIdLocal($id: ID!) {
    updateIdLocal(id: $id) @client {
      id
      __typename
    }
  }
`;

export const SET_AGE_PREFERENCE_LOCAL = gql`
  mutation updateAgePreferenceLocal($id: ID!, $minAgePreference: Int!, $maxAgePreference: Int!) {
    updateAgePreferenceLocal(
      id: $id
      minAgePreference: $minAgePreference
      maxAgePreference: $maxAgePreference
    ) @client {
      id
      minAgePreference
      maxAgePreference
      __typename
    }
  }
`;

export const SET_DISTANCE_LOCAL = gql`
  mutation updateDistanceLocal($id: String!, $distance: Int!) {
    updateDistanceLocal(id: $id, distance: $distance) @client {
      id
      distance
      __typename
    }
  }
`;

export const SET_NOTIFICATIONS_LOCAL = gql`
  mutation updateSendNotificationsLocal($id: String!, $sendNotifications: Boolean!) {
    updateSendNotificationsLocal(id: $id, sendNotifications: $sendNotifications) @client {
      id
      sendNotifications
      __typename
    }
  }
`;
