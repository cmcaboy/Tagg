"use strict";
//const graphql = require('graphql');
//import * as graphql from 'graphql';
//const driver = require('../../db/neo4j');
Object.defineProperty(exports, "__esModule", { value: true });
var neo4j_1 = require("../../db/neo4j");
//const session = driver.session();
var graphql_1 = require("graphql");
var match_type_1 = require("./match_type");
var session = neo4j_1.driver.session();
var UserType = new graphql_1.GraphQLObjectType({
    name: 'User',
    fields: function () { return ({
        id: { type: graphql_1.GraphQLString },
        active: { type: graphql_1.GraphQLBoolean },
        name: { type: graphql_1.GraphQLString },
        email: { type: graphql_1.GraphQLString },
        age: { type: graphql_1.GraphQLString },
        description: { type: graphql_1.GraphQLString },
        school: { type: graphql_1.GraphQLString },
        work: { type: graphql_1.GraphQLString },
        sendNotifications: { type: graphql_1.GraphQLBoolean },
        gender: { type: graphql_1.GraphQLString },
        distance: { type: graphql_1.GraphQLInt },
        token: { type: graphql_1.GraphQLString },
        latitude: { type: graphql_1.GraphQLFloat },
        longitude: { type: graphql_1.GraphQLFloat },
        minAgePreference: { type: graphql_1.GraphQLInt },
        maxAgePreference: { type: graphql_1.GraphQLInt },
        match: { type: graphql_1.GraphQLBoolean },
        pics: { type: new graphql_1.GraphQLList(graphql_1.GraphQLString) },
        profilePic: { type: graphql_1.GraphQLString },
        likes: {
            type: new graphql_1.GraphQLList(UserType),
            resolve: function (parentValue, args) {
                return session
                    .run("MATCH(a:User{id:'" + parentValue.id + "'})-[r:LIKES]->(b:User) RETURN b")
                    .then(function (result) { return result.records; })
                    .then(function (records) { return records.map(function (record) { return record._fields[0].properties; }); })
                    .catch(function (e) { return console.log('likes error: ', e); });
                //session.close();
            }
        },
        dislikes: {
            type: new graphql_1.GraphQLList(UserType),
            resolve: function (parentValue, args) {
                return session
                    .run("MATCH(a:User{id:'" + parentValue.id + "'})-[r:DISLIKES]->(b:User) RETURN b")
                    .then(function (result) { return result.records; })
                    .then(function (records) { return records.map(function (record) { return record._fields[0].properties; }); })
                    .catch(function (e) { return console.log('dislikes error: ', e); });
            }
        },
        matches: {
            args: {
                id: { type: graphql_1.GraphQLID },
            },
            type: new graphql_1.GraphQLList(match_type_1.MatchType),
            resolve: function (parentValue, args) {
                var query = '';
                if (args.id) {
                    query = "MATCH(a:User{id:'" + parentValue.id + "'})-[r:LIKES]->(b:User{id:'" + args.id + "'}) where r.matchId IS NOT NULL RETURN b,r.matchId";
                }
                else {
                    query = "MATCH(a:User{id:'" + parentValue.id + "'})-[r:LIKES]->(b:User) where r.matchId IS NOT NULL RETURN b,r.matchId";
                }
                return session
                    .run(query)
                    .then(function (result) {
                    return result.records;
                })
                    .then(function (records) {
                    return records.map(function (record) {
                        return {
                            user: record._fields[0].properties,
                            matchId: record._fields[1]
                        };
                    });
                })
                    .catch(function (e) { return console.log('matches error: ', e); });
            }
        },
        queue: {
            type: new graphql_1.GraphQLList(UserType),
            resolve: function (parentValue, args) {
                // Should add distance calculation here
                return session
                    .run("MATCH(a:User{id:'" + parentValue.id + "'}),(b:User) \n                        where NOT (a)-[:LIKES|DISLIKES]->(b) AND \n                        NOT b.id='" + parentValue.id + "' AND\n                        NOT b.gender='" + parentValue.gender + "'\n                        RETURN b")
                    .then(function (result) { return result.records; })
                    .then(function (records) { return records.map(function (record) { return record._fields[0].properties; }); })
                    .catch(function (e) { return console.log('queue error: ', e); });
            }
        },
    }); }
});
exports.UserType = UserType;
