"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
var firestore_1 = require("../../db/firestore");
var moment = require('moment');
var message_type_1 = require("../types/message_type");
var newMessage = {
    type: message_type_1.MessageType,
    args: {
        matchId: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
        id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
        name: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        message: { type: graphql_1.GraphQLString }
    },
    resolve: function (_, args) {
        console.log('args: ', args);
        var message = {
            id: args.id,
            name: args.name,
            message: args.message,
            //date: moment().format('MMMM Do YYYY, h:mm:ss a')
            date: new Date()
        };
        return firestore_1.db.collection("matches/" + args.matchId + "/messages").add(message)
            .then(function () {
            console.log(args.name + " posted message to matchId " + args.matchId);
            return message;
        })
            .catch(function (e) { return console.error("error writing new message to " + args.matchId + ": " + e); });
    }
};
exports.newMessage = newMessage;
