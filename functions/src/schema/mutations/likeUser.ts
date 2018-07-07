import {driver} from '../../db/neo4j';
import { 
    GraphQLNonNull,
    GraphQLID,
} from 'graphql';
import { UserType } from '../types/user_type';
const uuid = require('node-uuid');
import {db} from '../../db/firestore';
const moment = require('moment');

const session = driver.session();

const likeUser = {
    type: UserType,
    args: {
        id: { type: new GraphQLNonNull(GraphQLID)},
        likedId: { type: new GraphQLNonNull(GraphQLID)}
    },
    async resolve(parentValue, args) {

        // command to create like
        const mutate = `MATCH (a:User {id:'${args.id}'}), (b:User {id:'${args.likedId}'}) MERGE (a)-[r:LIKES]->(b) return b`;
        // query to check to see if like is mutual
        const query = `MATCH (a:User {id:'${args.id}'})<-[r:LIKES]-(b:User {id:'${args.likedId}'}) return b`;

        // Create the like in neo4j
        const result = await session.run(mutate);
        const user = result.records[0]._fields[0].properties;

        // Check Match
        const resultMatch = await session.run(query);
        
        // Check to see if the like is mutual
        if(resultMatch.records.length > 0) {

            const matchId = uuid.v1();

            try {
                await session.run(`MATCH (a:User {id:'${args.id}'})<-[r:LIKES]-(b:User {id:'${args.likedId}'}) SET r.matchId='${matchId}'`)
                await session.run(`MATCH (a:User {id:'${args.id}'})-[r:LIKES]->(b:User {id:'${args.likedId}'}) SET r.matchId='${matchId}'`)
                await db.collection(`matches`).doc(`${matchId}`).set({
                    user1: args.id,
                    user2: args.likedId,
                    matchTime: new Date()
                })
            } catch(e) {
                console.log('likeUser error creating match: ',e)
            }
            return { id: args.likedId, name: user.name, match: true}
        }
        return { id: args.likedId, name: user.name, match: false}
    }
}

export {likeUser};