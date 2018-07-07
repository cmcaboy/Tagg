import {driver} from '../../db/neo4j';
import { 
    GraphQLNonNull,
    GraphQLID,
} from 'graphql';
import { UserType } from '../types/user_type';

const session = driver.session();

const dislikeUser = {
    type: UserType,
    args: {
        id: { type: new GraphQLNonNull(GraphQLID)},
        dislikedId: { type: new GraphQLNonNull(GraphQLID)}
    },
    resolve(parentValue, args) {
        const query = `MATCH (a:User {id:'${args.id}'}), (b:User {id:'${args.dislikedId}'}) MERGE (a)-[r:DISLIKES]->(b) return a,b,r`;

        return session
            .run(query)
            .then(result => {
                return result.records
            })
            .then(records => records[0]._fields[0].properties)
            .catch(e => console.log('disLikeUser error: ',e))
    }
}

export {dislikeUser};