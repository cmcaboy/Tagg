//import * as graphql from 'graphql';
import {driver} from '../../db/neo4j';
//const UserType = require('./user_type');
import {UserType} from './user_type';
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
} from 'graphql';

const session = driver.session();

const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    user: {
      type: UserType,
      args: { 
        id: { type: GraphQLID},
        token: { type: GraphQLString},
      },
      resolve(parentValue, args) {
        if(args.id) {
          return session.run(`Match (n:User {id: '${args.id}'}) RETURN n`)
            .then(result => result.records)
            .then(records => {
              if(!records.length) {
                return null;
              }
              const properties =  records[0]._fields[0].properties;
              return {
                ...properties,
                profilePic: !!properties.pics? properties.pics[0]: null
              }
            })
            .catch(e => console.log('id lookup error: ',e))
          } else {
            console.log('args: ',args);
            return session.run(`Match (n:User {token: '${args.token}'}) RETURN n`)
              .then(result => result.records)
              .then(records => {
                console.log('records: ',records);
                if(!records.length) {
                  return null;
                }
                const properties =  records[0]._fields[0].properties;
                return {
                  ...properties,
                  profilePic: !!properties.pics? properties.pics[0]: null
                }
              })
              .catch(e => console.log('token lookup error: ',e))
        }
      }        
    }
  })
})

export { RootQueryType }; 