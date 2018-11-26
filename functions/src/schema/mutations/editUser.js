"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var neo4j_1 = require("../../db/neo4j");
var graphql_1 = require("graphql");
var user_type_1 = require("../types/user_type");
var session = neo4j_1.driver.session();
var editUser = {
    type: user_type_1.UserType,
    args: {
        id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
        name: { type: graphql_1.GraphQLString },
        active: { type: graphql_1.GraphQLBoolean },
        email: { type: graphql_1.GraphQLString },
        gender: { type: graphql_1.GraphQLString },
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
        var isBoolean = function (val) { return 'boolean' === typeof val; };
        console.log('args: ', args);
        var query = "MATCH(a:User{id: '" + args.id + "'}) SET ";
        !!args.name && (query = query + ("a.name='" + args.name + "',"));
        isBoolean(args.active) && (query = query + ("a.active=" + args.active + ","));
        !!args.email && (query = query + ("a.email='" + args.email + "',"));
        !!args.gender && (query = query + ("a.gender='" + args.gender + "',"));
        !!args.age && (query = query + ("a.age=" + args.age + ","));
        !!args.description && (query = query + ("a.description='" + args.description + "',"));
        !!args.school && (query = query + ("a.school='" + args.school + "',"));
        !!args.work && (query = query + ("a.work='" + args.work + "',"));
        !!args.token && (query = query + ("a.token='" + args.token + "',"));
        isBoolean(args.sendNotifications) && (query = query + ("a.sendNotifications=" + args.sendNotifications + ","));
        !!args.distance && (query = query + ("a.distance=" + args.distance + ","));
        !!args.latitude && (query = query + ("a.latitude=" + args.latitude + ","));
        !!args.longitude && (query = query + ("a.longitude=" + args.longitude + ","));
        !!args.minAgePreference && (query = query + ("a.minAgePreference=" + args.minAgePreference + ","));
        !!args.maxAgePreference && (query = query + ("a.maxAgePreference=" + args.maxAgePreference + ","));
        !!args.pics && (query = query + ("a.pics=[" + args.pics.map(function (pic) { return "\"" + pic + "\""; }) + "],"));
        console.log('query slice: ', query.slice(0, -1));
        query = query.slice(-1) === ',' ? query.slice(0, -1) : query;
        query = query + " RETURN a";
        console.log('query: ', query);
        return session
            .run(query)
            .then(function (result) {
            console.log('result: ', result);
            return result.records;
        })
            .then(function (records) { return records[0]._fields[0].properties; })
            .catch(function (e) { return console.log('editUser error: ', e); });
    }
};
exports.editUser = editUser;
