"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
var LikeUserType = new graphql_1.GraphQLObjectType({
    name: 'LikeUserType',
    fields: function () { return ({
        likedId: { type: graphql_1.GraphQLString },
        name: { type: graphql_1.GraphQLString },
        match: { type: graphql_1.GraphQLBoolean },
    }); }
});
exports.LikeUserType = LikeUserType;
