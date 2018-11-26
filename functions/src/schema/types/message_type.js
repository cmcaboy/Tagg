"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
var MessageType = new graphql_1.GraphQLObjectType({
    name: 'MessageType',
    fields: function () { return ({
        id: { type: graphql_1.GraphQLID },
        name: { type: graphql_1.GraphQLString },
        date: { type: graphql_1.GraphQLString },
        message: { type: graphql_1.GraphQLString },
    }); }
});
exports.MessageType = MessageType;
