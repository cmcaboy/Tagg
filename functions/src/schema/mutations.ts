import { 
    GraphQLObjectType,
} from 'graphql';
import {newUser} from './mutations/newUser';
import {editUser} from './mutations/editUser';
import {likeUser} from './mutations/likeUser';
import {dislikeUser} from './mutations/dislikeUser';
import {newMessage} from './mutations/newMessage';

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        newUser,
        editUser,
        likeUser,
        dislikeUser,
        newMessage,
    }
})

export {mutation};