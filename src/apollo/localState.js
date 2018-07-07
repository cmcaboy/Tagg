import gql from 'graphql-tag';

export const resolvers = {
    Mutation: {
      updateAgePreferenceLocal: (_, { minAgePreference, maxAgePreference }, { cache, getCacheKey }) => {
  
        const query = gql`
          query getAgePreferenceLocal {
            user @client {
                id
                __typename
                minAgePreference
                maxAgePreference
            }
          }
        `
        const previous = cache.readQuery({query});
  
        const data = {
          user: {
            ...previous.user,
            //id: previous.user.id,
            minAgePreference,
            maxAgePreference,
          }
        };
        
        cache.writeQuery({query,data});
        return null;
      },
      updateDistanceLocal: (_, { id, distance }, { cache, getCacheKey }) => {
  
        const query = gql`
          query getDistanceLocal {
            user @client {
                id
                __typename
                distance
            }
          }
        `
        const previous = cache.readQuery({query});
  
        const data = {
          user: {
            ...previous.user,
            distance: distance
          }
        };
  
        console.log('previous: ',previous);
        console.log('data: ',data);
        
        cache.writeQuery({query,data})
        return null;
      },
      updateIdLocal: (_, { id }, { cache, getCacheKey }) => {
  
        const query = gql`
          query getIdLocal {
            user @client {
                id
                __typename
            }
          }
        `
        //const previous = cache.readQuery({query});
        
        const data = {
          user: {
            __typename: 'user',
            id
          }
        };
        
        cache.writeQuery({query,data})
  
        return null;
      },
      updateSendNotificationsLocal: (_, { id, sendNotifications }, { cache, getCacheKey }) => {
  
        const query = gql`
          query getSendNotificationsLocal {
            user @client {
                id
                __typename
                sendNotifications
            }
          }
        `
        const previous = cache.readQuery({query});
  
        const data = {
          user: {
            ...previous.user,
            sendNotifications: sendNotifications
          }
        };
  
        console.log('previous: ',previous);
        console.log('data: ',data);
        
        cache.writeQuery({query,data})
        return null;
      },
    }
  }
  
  export const defaults = {
      user: {
        __typename: 'user',
        id: 6,
        minAgePreference: 18,
        maxAgePreference: 25,
        distance: 15,
        sendNotifications: true
      }
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
    `