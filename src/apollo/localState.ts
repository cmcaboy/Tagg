import gql from 'graphql-tag';

export const resolvers = {
  Mutation: {
    updateAgePreferenceLocal: (
      _: null,
      {
        minAgePreference,
        maxAgePreference,
      }: { minAgePreference: number; maxAgePreference: number },
      { cache }: { cache: any },
    ): any => {
      const query = gql`
        query getAgePreferenceLocal {
          id
          user @client {
            __typename
            minAgePreference
            maxAgePreference
          }
        }
      `;
      const previous = cache.readQuery({ query });

      const data = {
        user: {
          ...previous.user,
          // id: previous.user.id,
          minAgePreference,
          maxAgePreference,
        },
      };

      cache.writeQuery({ query, data });
      return null;
    },
    updateDistanceLocal: (
      _: null,
      { distance }: { distance: number },
      { cache }: { cache: any },
    ): any => {
      const query = gql`
        query getDistanceLocal {
          user @client {
            id
            __typename
            distance
          }
        }
      `;
      const previous = cache.readQuery({ query });

      const data = {
        user: {
          ...previous.user,
          distance,
        },
      };

      console.log('previous: ', previous);
      console.log('data: ', data);

      cache.writeQuery({ query, data });
      return null;
    },
    updateIdLocal: (_: any, { id }: { id: any }, { cache }: { cache: any }): any => {
      const query = gql`
        query getIdLocal {
          user @client {
            id
            __typename
          }
        }
      `;
      // const previous = cache.readQuery({query});

      const data = {
        user: {
          __typename: 'user',
          id,
        },
      };

      cache.writeQuery({ query, data });

      return null;
    },
    updateSendNotificationsLocal: (
      _: null,
      { sendNotifications }: { sendNotifications: boolean },
      { cache }: { cache: any },
    ): any => {
      const query = gql`
        query getSendNotificationsLocal {
          user @client {
            id
            __typename
            sendNotifications
          }
        }
      `;

      const previous = cache.readQuery({ query });

      const data = {
        user: {
          ...previous.user,
          sendNotifications,
        },
      };

      console.log('previous: ', previous);
      console.log('data: ', data);

      cache.writeQuery({ query, data });
      return null;
    },
  },
};
export const defaults = {
  user: {
    __typename: 'user',
    id: 0,
  },
};

export const typeDefs = `
  type user {
    id: Int!
  }

  type Mutation {
    alterId(id: Int!): user
  }

  type Query {
    visibilityFilter: String
    getUser: user
  }
`;
