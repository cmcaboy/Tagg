
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

const editUser = {
    type: UserType,
    args: {
        id: { type: new GraphQLNonNull(GraphQLID)},
        name: { type: GraphQLString},
        active: { type: GraphQLBoolean},
        email: { type: GraphQLString},
        gender: { type: GraphQLString},
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
        const isBoolean = val => 'boolean' === typeof val;
        console.log('args: ',args)
        let query = `MATCH(a:User{id: '${args.id}'}) SET `;
        !!args.name && (query = query+ `a.name='${args.name}',`)
        isBoolean(args.active) && (query = query+ `a.active=${args.active},`)
        !!args.email && (query = query+ `a.email='${args.email}',`)
        !!args.gender && (query = query+ `a.gender='${args.gender}',`)
        !!args.age && (query = query+ `a.age=${args.age},`)
        !!args.description && (query = query+ `a.description='${args.description}',`)
        !!args.school && (query = query+ `a.school='${args.school}',`)
        !!args.work && (query = query+ `a.work='${args.work}',`)
        !!args.token && (query = query+ `a.token='${args.token}',`)
        isBoolean(args.sendNotifications) && (query = query+ `a.sendNotifications=${args.sendNotifications},`)
        !!args.distance && (query = query+ `a.distance=${args.distance},`)
        !!args.latitude && (query = query+ `a.latitude=${args.latitude},`)
        !!args.longitude && (query = query+ `a.longitude=${args.longitude},`)
        !!args.minAgePreference && (query = query+ `a.minAgePreference=${args.minAgePreference},`)
        !!args.maxAgePreference && (query = query+ `a.maxAgePreference=${args.maxAgePreference},`)
        !!args.pics && (query = query+ `a.pics=[${args.pics.map(pic => `"${pic}"`)}],`)

        console.log('query slice: ',query.slice(0,-1));
        query = query.slice(-1) === ','? query.slice(0,-1) : query;
        query = query + ` RETURN a`;
        console.log('query: ',query);
        
        return session
            .run(query)
            .then(result => {
                console.log('result: ',result);
                return result.records
            })
            .then(records => records[0]._fields[0].properties)
            .catch(e => console.log('editUser error: ',e))
    }
}

export {editUser};