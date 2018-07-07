import {driver} from '../../db/neo4j';
import { 
    GraphQLString,
    GraphQLNonNull,
    GraphQLID,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLFloat,
    GraphQLList,
} from 'graphql';
import { UserType } from '../types/user_type';

const session = driver.session();

const newUser = {
    type: UserType,
    args: {
        id: { type: new GraphQLNonNull(GraphQLID)},
        name: { type: new GraphQLNonNull(GraphQLString)},
        active: { type: new GraphQLNonNull(GraphQLBoolean)},
        email: { type: new GraphQLNonNull(GraphQLString)},
        gender: { type: new GraphQLNonNull(GraphQLString)},
        age: { type: GraphQLInt},
        description: { type: GraphQLString},
        school: { type: GraphQLString},
        work: { type: GraphQLString},
        sendNotifications: { type: GraphQLBoolean},
        distance: { type: GraphQLInt},
        token: { type: GraphQLString},
        latitude: { type: GraphQLFloat},
        longitude: { type: GraphQLFloat},
        minAgePreference: { type: GraphQLInt},
        maxAgePreference: { type: GraphQLInt},
        pics: { type: new GraphQLList(GraphQLString)},
    },
    resolve(parentValue, args) {
        console.log('args: ',args)
        let query = `CREATE(a:User{
            id: '${args.id}',
            name: '${args.name}',
            active: ${args.active},
            email: '${args.email}',
            gender: '${args.gender}',`;
        !!args.age && (query = query+ `age:${args.age},`)
        !!args.description && (query = query+ `description:'${args.description}',`)
        !!args.school && (query = query+ `school:'${args.school}',`)
        !!args.work && (query = query+ `work:'${args.work}',`)
        !!args.token && (query = query+ `token:'${args.token}',`)
        !!args.sendNotifications && (query = query+ `sendNotifications:${args.sendNotifications},`)
        !!args.distance && (query = query+ `distance:${args.distance},`)
        !!args.latitude && (query = query+ `latitude:${args.latitude},`)
        !!args.longitude && (query = query+ `longitude:${args.longitude},`)
        !!args.minAgePreference && (query = query+ `minAgePreference:${args.minAgePreference},`)
        !!args.maxAgePreference && (query = query+ `maxAgePreference:${args.maxAgePreference},`)
        !!args.pics && (query = query+ `pics:[${args.pics.map(pic => `"${pic}"`)}],`)

        query = query.slice(-1) === ','? query.slice(0,-1) : query;

        query = query + `}) RETURN a`;
        console.log('query: ',query);
        return session
            .run(query)
            .then(result => {
                console.log('result: ',result);
                return result.records
            })
            .then(records => records[0]._fields[0].properties)
            .catch(e => console.log('newUser error: ',e))
    }
}

export {newUser};
