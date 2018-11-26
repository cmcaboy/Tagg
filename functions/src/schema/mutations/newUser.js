"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var neo4j_1 = require("../../db/neo4j");
var graphql_1 = require("graphql");
var user_type_1 = require("../types/user_type");
var session = neo4j_1.driver.session();
var newUser = {
    type: user_type_1.UserType,
    args: {
        id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
        name: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        active: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLBoolean) },
        email: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        gender: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        age: { type: graphql_1.GraphQLInt },
        description: { type: graphql_1.GraphQLString },
        school: { type: graphql_1.GraphQLString },
        work: { type: graphql_1.GraphQLString },
        sendNotifications: { type: graphql_1.GraphQLBoolean },
        distance: { type: graphql_1.GraphQLInt },
        token: { type: graphql_1.GraphQLString },
        latitude: { type: graphql_1.GraphQLFloat },
        longitude: { type: graphql_1.GraphQLFloat },
        minAgePreference: { type: graphql_1.GraphQLInt },
        maxAgePreference: { type: graphql_1.GraphQLInt },
        pics: { type: new graphql_1.GraphQLList(graphql_1.GraphQLString) },
    },
    resolve: function (parentValue, args) {
        console.log('args: ', args);
        var query = "CREATE(a:User{\n            id: '" + args.id + "',\n            name: '" + args.name + "',\n            active: " + args.active + ",\n            email: '" + args.email + "',\n            gender: '" + args.gender + "',";
        !!args.age && (query = query + ("age:" + args.age + ","));
        !!args.description && (query = query + ("description:'" + args.description + "',"));
        !!args.school && (query = query + ("school:'" + args.school + "',"));
        !!args.work && (query = query + ("work:'" + args.work + "',"));
        !!args.token && (query = query + ("token:'" + args.token + "',"));
        !!args.sendNotifications && (query = query + ("sendNotifications:" + args.sendNotifications + ","));
        !!args.distance && (query = query + ("distance:" + args.distance + ","));
        !!args.latitude && (query = query + ("latitude:" + args.latitude + ","));
        !!args.longitude && (query = query + ("longitude:" + args.longitude + ","));
        !!args.minAgePreference && (query = query + ("minAgePreference:" + args.minAgePreference + ","));
        !!args.maxAgePreference && (query = query + ("maxAgePreference:" + args.maxAgePreference + ","));
        !!args.pics && (query = query + ("pics:[" + args.pics.map(function (pic) { return "\"" + pic + "\""; }) + "],"));
        query = query.slice(-1) === ',' ? query.slice(0, -1) : query;
        query = query + "}) RETURN a";
        console.log('query: ', query);
        return session
            .run(query)
            .then(function (result) {
            console.log('result: ', result);
            return result.records;
        })
            .then(function (records) { return records[0]._fields[0].properties; })
            .catch(function (e) { return console.log('newUser error: ', e); });
    }
};
exports.newUser = newUser;
