"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var neo4j_1 = require("../../db/neo4j");
var graphql_1 = require("graphql");
var user_type_1 = require("../types/user_type");
var session = neo4j_1.driver.session();
var dislikeUser = {
    type: user_type_1.UserType,
    args: {
        id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
        dislikedId: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) }
    },
    resolve: function (parentValue, args) {
        var query = "MATCH (a:User {id:'" + args.id + "'}), (b:User {id:'" + args.dislikedId + "'}) MERGE (a)-[r:DISLIKES]->(b) return a,b,r";
        return session
            .run(query)
            .then(function (result) {
            return result.records;
        })
            .then(function (records) { return records[0]._fields[0].properties; })
            .catch(function (e) { return console.log('disLikeUser error: ', e); });
    }
};
exports.dislikeUser = dislikeUser;
