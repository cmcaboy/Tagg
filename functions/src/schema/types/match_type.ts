import  {
    GraphQLObjectType,
    GraphQLString, // GraphQL's string type
    GraphQLList,
  } from 'graphql';
  import {MessageType} from './message_type';
  import {UserType} from './user_type';
  import {db} from '../../db/firestore';
  
  const MatchType = new GraphQLObjectType({
    name: 'MatchType',
    fields: () => ({
        matchId: {type: GraphQLString},
        user: {type: UserType},
        messages: {
            type: new GraphQLList(MessageType),
            async resolve(parentValue,_) {
                if(!parentValue.matchId) {
                    return [];
                }
                const data = await db.collection(`matches/${parentValue.matchId}/messages`).orderBy("date", "desc").limit(50).get();

                return data.docs.map(doc => {
                    const docData = doc.data();
                    return {
                        id: docData.id,
                        name: docData.name,
                        date: docData.date,
                        message: docData.message
                    };
                })
            }
        },
        lastMessage: {
            type: MessageType,
            async resolve(parentValue,_) {
                if(!parentValue.matchId) {
                    return null;
                }

                try {
                    // Can use a desc option if orderBy if I need to get opposite order.
                    // citiesRef.orderBy("state").orderBy("population", "desc")
                    const data = await db.collection(`matches/${parentValue.matchId}/messages`).orderBy("date", "desc").limit(1).get();

                    if(!data.docs) {
                        return null;
                    }

                    const messages = data.docs.map(doc => {
                        const docData = doc.data();
                        return {
                            id: docData.id,
                            name: docData.name,
                            date: docData.date,
                            message: docData.message
                        };
                    })
    
                    // This array should only have 1 element, but I want to return just the element rather than a 1 length array.
                    return messages[0];

                } catch(e) {
                    console.log('error fetching last message: ',e);
                    return null
                }
            }
        }
    })
  });

  export {MatchType};