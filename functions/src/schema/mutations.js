"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
var newUser_1 = require("./mutations/newUser");
var editUser_1 = require("./mutations/editUser");
var likeUser_1 = require("./mutations/likeUser");
var dislikeUser_1 = require("./mutations/dislikeUser");
var newMessage_1 = require("./mutations/newMessage");
var mutation = new graphql_1.GraphQLObjectType({
    name: 'Mutation',
    fields: {
        newUser: newUser_1.newUser,
        editUser: editUser_1.editUser,
        likeUser: likeUser_1.likeUser,
        dislikeUser: dislikeUser_1.dislikeUser,
        newMessage: newMessage_1.newMessage,
    }
});
exports.mutation = mutation;
