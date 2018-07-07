//const graphql = require('graphql');
//import * as graphql from 'graphql';
//const driver = require('../../db/neo4j');

import {driver} from '../../db/neo4j';

//const session = driver.session();

import  {
    GraphQLObjectType,
    GraphQLString, // GraphQL's string type
    GraphQLInt, // GraphQL's int type
    //GraphQLSchema,
    GraphQLList,
    //GraphQLNonNull,
    GraphQLFloat,
    GraphQLBoolean,
    GraphQLID,
  } from 'graphql';
  import {MatchType} from './match_type';

  const session = driver.session();
  
  const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: {type: GraphQLString},
        active: {type: GraphQLBoolean},
        name: {type: GraphQLString},
        email: {type: GraphQLString},
        age: {type: GraphQLString},
        description: {type: GraphQLString},
        school: {type: GraphQLString},
        work: {type: GraphQLString},
        sendNotifications: {type: GraphQLBoolean},
        gender: {type: GraphQLString},
        distance: {type: GraphQLInt},
        token: {type: GraphQLString}, // fb auth token
        latitude: {type: GraphQLFloat},
        longitude: {type: GraphQLFloat},
        minAgePreference: {type: GraphQLInt},
        maxAgePreference: {type: GraphQLInt},
        match: {type: GraphQLBoolean},
        pics: {type: new GraphQLList(GraphQLString)},
        profilePic: {type: GraphQLString},
        likes: {
            type: new GraphQLList(UserType),
            resolve(parentValue, args) {
                return session
                    .run(`MATCH(a:User{id:'${parentValue.id}'})-[r:LIKES]->(b:User) RETURN b`)
                        .then(result => result.records)
                        .then(records => records.map(record => record._fields[0].properties))
                        .catch(e => console.log('likes error: ',e))
                //session.close();
            }
        },
        dislikes: {
            type: new GraphQLList(UserType),
            resolve(parentValue, args) {
                return session
                    .run(`MATCH(a:User{id:'${parentValue.id}'})-[r:DISLIKES]->(b:User) RETURN b`)
                        .then(result => result.records)
                        .then(records => records.map(record => record._fields[0].properties))
                        .catch(e => console.log('dislikes error: ',e))
            }
        },
        matches: {
            args: { 
                id: { type: GraphQLID},
              },
            type: new GraphQLList(MatchType),
            resolve(parentValue, args) {
                let query = '';
                if(args.id) {
                    query = `MATCH(a:User{id:'${parentValue.id}'})-[r:LIKES]->(b:User{id:'${args.id}'}) where r.matchId IS NOT NULL RETURN b,r.matchId`;
                } else {
                    query = `MATCH(a:User{id:'${parentValue.id}'})-[r:LIKES]->(b:User) where r.matchId IS NOT NULL RETURN b,r.matchId`;
                }
                return session
                    .run(query)
                        .then(result => {
                            return result.records
                        })
                        .then(records => {
                            return records.map(record => {
                                return {
                                user: record._fields[0].properties,
                                matchId: record._fields[1]
                                }
                            })
                        })
                        .catch(e => console.log('matches error: ',e))
            }
        },
        queue: {
            type: new GraphQLList(UserType),
            resolve(parentValue, args) {
                // Should add distance calculation here
                return session
                    .run(`MATCH(a:User{id:'${parentValue.id}'}),(b:User) 
                        where NOT (a)-[:LIKES|DISLIKES]->(b) AND 
                        NOT b.id='${parentValue.id}' AND
                        NOT b.gender='${parentValue.gender}'
                        RETURN b`)
                        .then(result => result.records)
                        .then(records => records.map(record => record._fields[0].properties))
                        .catch(e => console.log('queue error: ',e))
            }
        },
    })
  });

  // queue: MATCH(a:User{name:"Nathan"}),(b:User) where NOT (a)-[:LIKES|DISLIKES]->(b) RETURN b

  //MATCH(a:User{name:"Nathan"})-[r:LIKES]->(b:User) RETURN b
  
  export {UserType};