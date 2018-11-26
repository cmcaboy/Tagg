"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
//import * as graphql from 'graphql';
var neo4j_1 = require("../../db/neo4j");
//const UserType = require('./user_type');
var user_type_1 = require("./user_type");
var graphql_1 = require("graphql");
var session = neo4j_1.driver.session();
var RootQueryType = new graphql_1.GraphQLObjectType({
    name: 'RootQueryType',
    fields: function () { return ({
        user: {
            type: user_type_1.UserType,
            args: {
                id: { type: graphql_1.GraphQLID },
                token: { type: graphql_1.GraphQLString },
            },
            resolve: function (parentValue, args) {
                if (args.id) {
                    return session.run("Match (n:User {id: '" + args.id + "'}) RETURN n")
                        .then(function (result) { return result.records; })
                        .then(function (records) {
                        if (!records.length) {
                            return null;
                        }
                        var properties = records[0]._fields[0].properties;
                        return __assign({}, properties, { profilePic: !!properties.pics ? properties.pics[0] : null });
                    })
                        .catch(function (e) { return console.log('id lookup error: ', e); });
                }
                else {
                    console.log('args: ', args);
                    return session.run("Match (n:User {token: '" + args.token + "'}) RETURN n")
                        .then(function (result) { return result.records; })
                        .then(function (records) {
                        console.log('records: ', records);
                        if (!records.length) {
                            return null;
                        }
                        var properties = records[0]._fields[0].properties;
                        return __assign({}, properties, { profilePic: !!properties.pics ? properties.pics[0] : null });
                    })
                        .catch(function (e) { return console.log('token lookup error: ', e); });
                }
            }
        }
    }); }
});
exports.RootQueryType = RootQueryType;
