import { 
    GraphQLNonNull,
    GraphQLID,
    GraphQLString,
} from 'graphql';
import {db} from '../../db/firestore';
const moment = require('moment');
import {MessageType} from '../types/message_type';

const newMessage = {
    type: MessageType,
    args: {
        matchId: { type: new GraphQLNonNull(GraphQLID)},
        id: { type: new GraphQLNonNull(GraphQLID)},
        name: { type: new GraphQLNonNull(GraphQLString)},
        message: { type: GraphQLString}
    },
    resolve(_, args) {
        console.log('args: ',args);
        const message = {
            id: args.id,
            name: args.name,
            message: args.message,
            //date: moment().format('MMMM Do YYYY, h:mm:ss a')
            date: new Date()
        };

        return db.collection(`matches/${args.matchId}/messages`).add(message)
            .then(() => {
                console.log(`${args.name} posted message to matchId ${args.matchId}`)
                return message;
            })
            .catch(e => console.error(`error writing new message to ${args.matchId}: ${e}`))
    }
}

export {newMessage};