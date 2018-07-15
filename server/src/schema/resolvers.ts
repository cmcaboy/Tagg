import {driver} from '../db/neo4j';
import {db} from '../db/firestore';
const uuid = require('node-uuid');
import { PubSub, withFilter } from 'graphql-subscriptions';

const pubsub = new PubSub();
const session = driver.session();

const NEW_MESSAGE = 'NEW_MESSAGE';
const MESSAGE_PAGE_LENGTH = 20;
const QUEUE_PAGE_LENGTH = 5;
const MATCH_PAGE_LENGTH = 5;

const resolvers = {
    Subscription: {
        newMessageSub: {
            // The resolve method is executed after the subscribe method w/ filter
            resolve: (payload) => payload.newMessageSub.message,
            // For the withFilter function, the first argument is the tag that you are subscribing to.
            // The second argument is the filter.
            subscribe: withFilter(
                () => pubsub.asyncIterator(NEW_MESSAGE),
                (payload,args) => {
                    console.log('payload: ',payload);
                    console.log('args: ',args);
                    return (payload.newMessageSub.matchId === args.matchId && payload.newMessageSub.message.uid != args.id)
                }
            ),
        },
    },
    Query: {
        user: (_, args) => {
            console.log('args: ',args);
            if(args.id) {
                console.log('args: ',args);
                return session.run(`Match (n:User {id: '${args.id}'}) RETURN n`)
                  .then(result => result.records)
                  .then(records => {
                      console.log('records: ',records);
                    if(!records.length) {
                      return null;
                    }
                    const properties =  records[0]._fields[0].properties;
                    return {
                      ...properties,
                      profilePic: !!properties.pics? properties.pics[0]: null
                    }
                  })
                  .catch(e => console.log('id lookup error: ',e))
                } else {
                  console.log('args: ',args);
                  return session.run(`Match (n:User {token: '${args.token}'}) RETURN n`)
                    .then(result => result.records)
                    .then(records => {
                      console.log('records: ',records);
                      if(!records.length) {
                        return null;
                      }
                      const properties =  records[0]._fields[0].properties;
                      return {
                        ...properties,
                        profilePic: !!properties.pics? properties.pics[0]: null
                      }
                    })
                    .catch(e => console.log('token lookup error: ',e))
              }
        },
        messages: async (_,args) => {
            console.log('in moreMessages');
            console.log('args: ',args);
            
            const query = db.collection(`matches/${args.id}/messages`).orderBy("order").limit(MESSAGE_PAGE_LENGTH);

            let data;
            try {
                data = await query.get();
            } catch(e) {
                console.log('error fetching more messages from firestore: ',e);
                return {
                    id: args.id,
                    list: [],
                    cursor: null,
                }
            }

            

            const messages = data.docs.map(doc => {
                const docData = doc.data();
                return {
                    name: docData.name,
                    avatar: docData.avatar,
                    uid: docData.uid,
                    text: docData.text,
                    createdAt: docData.createdAt,
                    order: docData.order,
                    _id: docData._id,
                };
            });

            // If there are no additional messages left, return an empty message array and
            // don't change the cursor
            if(messages.length === 0) {
                return {
                    id: args.id,
                    list: [],
                    cursor: null,
                }
            }

            // Set the new cursor to the last date in the message array
            // Return a null cursor if the message array length is less than 20, indicating that their
            // are no more messages left to retreive.
            const cursor = messages.length >= MESSAGE_PAGE_LENGTH ? messages[messages.length - 1].order : null;

            console.log('messages in moreMessages: ',messages);
            console.log('newCursor: ',cursor);

            return {
                id: args.id,
                list: messages,
                cursor,
            }
        },
        otherBids: (_, args) => {
            // dateID should be passed in as the id
            // Need to factor in pagination
            return session
                    .run(`MATCH(b:User)-[r:BID]->(d:Date{id:'${args.id}'}) RETURN b,d,r`)
                        .then(result => result.records)
                        .then(records => records.map(record => ({
                            id: args.id,
                            datetimeOfBid: record._fields[2].datetimeOfBid,
                            bidDescription: record._fields[2].bidDescription,
                            bidPlace: record._fields[2].bidPlace,
                            user: record._fields[0].properties,

                        })
                        ))
                        .catch(e => console.log('bid error: ',e))
        },
        moreMessages: async (_,args) => {
            console.log('in moreMessages');
            console.log('args: ',args);

            if(!args.cursor) {
                return {
                    id: args.id,
                    list: [],
                    cursor: null,
                }
            }
            
            let cursor = parseInt(args.cursor);
            const query = db.collection(`matches/${args.id}/messages`).orderBy("order").startAfter(cursor).limit(MESSAGE_PAGE_LENGTH);

            let data;
            try {
                data = await query.get();
            } catch(e) {
                console.log('error fetching more messages from firestore: ',e);
                return {
                    id: args.id,
                    list: [],
                    cursor,
                }
            }

            

            const messages = data.docs.map(doc => {
                const docData = doc.data();
                return {
                    name: docData.name,
                    avatar: docData.avatar,
                    uid: docData.uid,
                    text: docData.text,
                    createdAt: docData.createdAt,
                    order: docData.order,
                    _id: docData._id,
                };
            });

            // If there are no additional messages left, return an empty message array and
            // don't change the cursor
            if(messages.length === 0) {
                return {
                    id: args.id,
                    list: [],
                    cursor,
                }
            }

            // Set the new cursor to the last date in the message array
            // Return a null cursor if the message array length is less than 20, indicating that their
            // are no more messages left to retreive.
            const newCursor = messages.length >= MESSAGE_PAGE_LENGTH ? messages[messages.length - 1].order : null;

            console.log('messages in moreMessages: ',messages);
            console.log('newCursor: ',newCursor);

            return {
                id: args.id,
                list: messages,
                cursor: newCursor,
            }
        }, 
        moreQueue: (_, args) => {
            console.log('in Queue');
            console.log('args: ',args);

            if(!args.cursor) {
                console.log('No cursor passed in. You must be at the end of the list. No more values to retreive.');
                return {
                    list: [],
                    cursor: null,
                }
            } else if (!args.id) {
                console.error('Error! No id passed in!');
            }

            return session.run(`MATCH(a:User{id:'${args.id}'}),(b:User) 
                WITH a,b, size((b)<-[:FOLLOWING]-()) as num_likes,
                ((distance(point(a),point(b))*0.000621371)*(1/toFloat((SIZE((b)<-[:LIKES]-())+1)))) as order,
                distance(point(a),point(b))*0.000621371 as distanceApart,
                exists((a)-[:FOLLOWING]->(b)) as isFollowing,
                exists((b)-[:CREATE]->(:Date{open:TRUE})) as hasDateOpen
                where
                NOT b.id=a.id AND
                NOT b.gender=a.gender AND
                distanceApart < a.distance AND
                order > ${args.cursor}
                RETURN b, distanceApart, num_likes, order, isFollowing, hasDateOpen
                ORDER BY order
                LIMIT ${QUEUE_PAGE_LENGTH}`)
                .then(result => result.records)
                .then(records => {
                    const list = records.map(record => {
                        console.log('queue record: ',record);
                        console.log('field 0: ',record._fields[0]);
                        console.log('field 1: ',record._fields[1]);
                        console.log('field 2: ',record._fields[2]);
                        console.log('field 3: ',record._fields[3]);
                        return {
                            ...record._fields[0].properties,
                            distanceApart: record._fields[1],
                            order: record._fields[3],
                            profilePic: !!record._fields[0].properties.pics? record._fields[0].properties.pics[0]: null,
                            isFollowing: record._fields[4],
                            hasDateOpen: record._fields[5], 
                        }   
                    })
                    if(list.length === 0) {
                        // If the list is empty, return a blank list and a null cursor
                        return {
                            list: [],
                            cursor: null,
                        }
                    }

                    const newCursor = list.length >= QUEUE_PAGE_LENGTH ? list[list.length - 1].order : null;

                    return {
                        list,
                        cursor: newCursor,
                    }
                }
                )
                .catch(e => console.log('moreQueue error: ',e))           
        }
    },
    User: {
        following: (parentValue, _) => {
            // Need to factor in pagination
            console.log('following parentValue: ',parentValue);
                return session
                    .run(`MATCH(a:User{id:'${parentValue.id}'})-[r:FOLLOWING]->(b:User) RETURN b`)
                        .then(result => result.records)
                        .then(records => {
                            console.log('following records: ',records);
                            const list = records.map(record => record._fields[0].properties)
                            console.log('following list: ',list);
                            return {
                                list,
                                cursor: null,
                            }
                        })
                        .catch(e => console.log('following error: ',e))
        },
        bids: (parentValue, _) => {
            console.log('bids parentValue: ',parentValue);
            // Need to factor in pagination
            return session
                    .run(`MATCH(a:User{id:'${parentValue.id}'})-[:BID]->(d:Date)<-[:CREATE]-(b:User) RETURN b,d`)
                        .then(result => result.records)
                        .then(records => {
                            console.log('bids records: ',records);
                            const list = records.map(record => ({
                                id: record._fields[1].dateId,
                                datetimeOfBid: record._fields[1].datetimeOfBid,
                                bidDescription: record._fields[1].bidDescription,
                                bidPlace: record._fields[1].bidPlace,
                                user: record._fields[0].properties,
                            }))
                            console.log('bids list: ',list);
                            return {
                                list,
                                cursor: null,
                            }
                        })
                        .catch(e => console.log('bid error: ',e))
        },
        dateRequests: (parentValue, _) => {
            // Need to factor in pagination
            return session
                .run(`MATCH(a:User{id:'${parentValue.id}'})-[:CREATE]->(d:Date) 
                    WITH a, d, size((d)<-[:BID]-(:User)) as num_bids
                    RETURN a,d,num_bids`)
                    .then(result => result.records)
                    .then(records => {
                        const list = records.forEach(record => ({
                            id: record._fields[1].properties.id,
                            creator: record._fields[0].properties,
                            creationTime: record._fields[1].properties.creationTime,
                            datetimeOfDate: record._fields[1].properties.datetimeOfDate,
                            description: record._fields[1].properties.description,
                            num_bids: record._fields[2],
                            open: record._fields[1].properties.open,
                        }))

                        return {
                            list,
                            cursor: null,
                        }
                    })
                    .catch(e => console.log('dateRequest error: ',e))
        },
        matchedDates: (parentValue, _) => {
            // A potential performance improvement would be to query Firestore directly
            // to get our list of matches
            // These matches should be sorted as well.

            //console.log('args: ',args);
            console.log('pareventValue.id: ',parentValue.id);               
            const query = `MATCH(a:User{id:'${parentValue.id}'}),(b:User),(d:Date)
                WHERE (a)-[:CREATE]->(d)<-[:BID{winner:TRUE}]-(b) OR
                (a)-[:BID{winner:TRUE}]->(d)<-[:CREATE]-(b)
                RETURN b,d.id`;               
            
            console.log('query: ',query);
                return session
                    .run(query)
                        .then(result => {
                            return result.records
                        })
                        .then(records => {
                            const list = records.map(record => {
                                // console.log('record: ',record)
                                // console.log('record field 1: ',record._fields[0])
                                return {
                                    user: record._fields[0].properties,
                                    matchId: record._fields[1], // Call it dateId?
                                }
                            })
                            if(list.length === 0) {
                                // If the list is empty, return a blank list and a null cursor
                                return {
                                    list: [],
                                    cursor: null,
                                }
                            }
        
                            //const newCursor = list.length >= MATCH_PAGE_LENGTH ? list[list.length - 1].order : null;
                            const newCursor = null;
                            console.log('matchedDates list: ',list);

                            return {
                                list,
                                cursor: newCursor,
                            }

                        })
                        .catch(e => console.log('matches error: ',e))
        },
        queue: (parentValue, _) => {
            console.log('parentValue: ',parentValue);
            //console.log('args: ',args);
            // for pagination, I would like to sort by the following algorithm
            // order = [1/(# of likes)] x (distanceApart) x (time on platform)
            // Priority is given by the lowest order number.
            // I don't have 'time on platform' factored in yet, but I will add it soon.
            // The query is sorted by smallest value first by default.
            // 
            return session.run(`MATCH(a:User{id:'${parentValue.id}'}),(b:User)
                WITH a,b, size((b)<-[:FOLLOWING]-()) as num_likes,
                distance(point(a),point(b))*0.000621371 as distanceApart,
                ((distance(point(a),point(b))*0.000621371)*(1/toFloat((SIZE((b)<-[:FOLLOWING]-())+1)))) as order,
                exists((a)-[:FOLLOWING]->(b)) as isFollowing,
                exists((b)-[:CREATE]->(:Date{open:TRUE})) as hasDateOpen
                where 
                NOT b.id=a.id AND
                NOT b.gender=a.gender AND
                distanceApart < a.distance
                RETURN b, distanceApart, num_likes, order, isFollowing, hasDateOpen
                ORDER BY order
                LIMIT ${QUEUE_PAGE_LENGTH}`)
                .then(result => result.records)
                .then(records => {
                    const list = records.map(record => {
                        console.log('queue record: ',record);
                        console.log('field 0: ',record._fields[0]);
                        console.log('field 1: ',record._fields[1]);
                        console.log('field 2: ',record._fields[2]);
                        console.log('field 3: ',record._fields[3]);
                        console.log('field 4: ',record._fields[4]);
                        console.log('field 5: ',record._fields[5]);
                        return {
                            ...record._fields[0].properties,
                            distanceApart: record._fields[1],
                            order: record._fields[3],
                            profilePic: !!record._fields[0].properties.pics? record._fields[0].properties.pics[0]: null,
                            isFollowing: record._fields[4],
                            hasDateOpen: record._fields[5], 
                        }   
                    })
                    if(list.length === 0) {
                        // If the list is empty, return a blank list and a null cursor
                        return {
                            list: [],
                            cursor: null,
                        }
                    }

                    const newCursor = list.length >= QUEUE_PAGE_LENGTH ? list[list.length - 1].order : null;

                    return {
                        list,
                        cursor: newCursor,
                    }
                }
                )
                .catch(e => console.log('queue error: ',e))
        }
    },
    DateItem: {
        bids: (parentValue, _) => {
            return session
                .run(`MATCH(b:User)-[r:BID]->(d:Date{id:'${parentValue.id}'}) RETURN b,d,r`)
                    .then(result => result.records)
                    .then(records => {
                        const list = records.map(record => ({
                        id: record._fields[1].properties.id,
                        datetimeOfBid: record._fields[2].properties.datetimeOfBid,
                        bidDescription: record._fields[2].properties.bidDescription,
                        bidPlace: record._fields[2].bidPlace,
                        user: record._fields[0].properties,
                    }))
                        return {
                            list,
                            cursor: null,
                        }
                    })
                    .catch(e => console.log('bid error: ',e))
        }
    },
    Match: {
        messages: async (parentValue, args) => {
            console.log('messages resolver');
            console.log('parentValue.matchId: ',parentValue.matchId);
            console.log('args: ',args);
            if(!parentValue.matchId) {
                return {
                    list: [],
                    cursor: null,
                }
            }
            const data = await db.collection(`matches/${parentValue.matchId}/messages`).orderBy("createdAt", "desc").limit(MESSAGE_PAGE_LENGTH).get();

            const messages = data.docs.map(doc => {
                const docData = doc.data();
                return {
                    name: docData.name,
                    avatar: docData.avatar,
                    uid: docData.uid,
                    text: docData.text,
                    createdAt: docData.createdAt,
                    order: docData.order,
                    _id: docData._id,
                };
            });

            const cursor = messages.length > 0 ? messages[messages.length - 1].order : null;

            console.log('messages in messages: ',messages);

            return {
                cursor,
                list: messages,
            }
                
        },
        lastMessage: async (parentValue, args) => {
            console.log('lastMessage resolver');
            console.log('parentValue.matchId: ',parentValue.matchId);
            console.log('args: ',args);
            if(!parentValue.matchId) {
                return null;
            }

            try {
                // Can use a desc option if orderBy if I need to get opposite order.
                // citiesRef.orderBy("state").orderBy("population", "desc")
                const data = await db.collection(`matches/${parentValue.matchId}/messages`).orderBy("createdAt", "desc").limit(1).get();

                if(!data.docs) {
                    return null;
                }

                const messages = data.docs.map(doc => {
                    const docData = doc.data();
                    return {
                        name: docData.name,
                        avatar: docData.avatar,
                        uid: docData.uid,
                        text: docData.text,
                        createdAt: docData.createdAt,
                        order: docData.order,
                        _id: docData._id,
                    };
                })

                // This array should only have 1 element, but I want to return just the element rather than a 1 length array.
                return messages[0];

            } catch(e) {
                console.log('error fetching last message: ',e);
                return null
            }
        }
    },
    Mutation: {
        editUser: (_, args) => {
            const isBoolean = val => 'boolean' === typeof val;
            console.log('args: ',args)
            let query = `MATCH(a:User{id: '${args.id}'}) SET `;
            !!args.name && (query = query+ `a.name='${args.name}',`)
            isBoolean(args.active) && (query = query+ `a.active=${args.active},`)
            !!args.email && (query = query+ `a.email='${args.email}',`)
            !!args.gender && (query = query+ `a.gender='${args.gender}',`)
            !!args.age && (query = query+ `a.age=${args.age},`)
            !!args.description && (query = query+ `a.description='${args.description}',`)
            !!args.school && (query = query+ `a.school='${args.school}',`)
            !!args.work && (query = query+ `a.work='${args.work}',`)
            !!args.token && (query = query+ `a.token='${args.token}',`)
            !!args.registerDateTime && (query = query+ `a.registerDateTime='${args.registerDateTime}',`)
            isBoolean(args.sendNotifications) && (query = query+ `a.sendNotifications=${args.sendNotifications},`)
            !!args.distance && (query = query+ `a.distance=${args.distance},`)
            !!args.latitude && (query = query+ `a.latitude=${args.latitude},`)
            !!args.longitude && (query = query+ `a.longitude=${args.longitude},`)
            !!args.minAgePreference && (query = query+ `a.minAgePreference=${args.minAgePreference},`)
            !!args.maxAgePreference && (query = query+ `a.maxAgePreference=${args.maxAgePreference},`)
            !!args.pics && (query = query+ `a.pics=[${args.pics.map(pic => `"${pic}"`)}],`)

            console.log('query slice: ',query.slice(0,-1));
            query = query.slice(-1) === ','? query.slice(0,-1) : query;
            query = query + ` RETURN a`;
            console.log('query: ',query);
            
            return session
                .run(query)
                .then(result => {
                    console.log('result: ',result);
                    return result.records
                })
                .then(records => records[0]._fields[0].properties)
                .catch(e => console.log('editUser error: ',e))
        },
        newUser: (_,args) => {
            console.log('args: ',args)
            let query = `CREATE(a:User{
                id: '${args.id}',
                name: '${args.name}',
                active: ${args.active},
                email: '${args.email}',
                gender: '${args.gender}',`;
            !!args.age && (query = query+ `age:${args.age},`)
            !!args.description && (query = query+ `description:'${args.description}',`)
            !!args.school && (query = query+ `school:'${args.school}',`)
            !!args.work && (query = query+ `work:'${args.work}',`)
            !!args.token && (query = query+ `token:'${args.token}',`)
            !!args.registerDateTime && (query = query+ `registerDateTime:'${args.registerDateTime}',`)
            !!args.sendNotifications && (query = query+ `sendNotifications:${args.sendNotifications},`)
            !!args.distance && (query = query+ `distance:${args.distance},`)
            !!args.latitude && (query = query+ `latitude:${args.latitude},`)
            !!args.longitude && (query = query+ `longitude:${args.longitude},`)
            !!args.minAgePreference && (query = query+ `minAgePreference:${args.minAgePreference},`)
            !!args.maxAgePreference && (query = query+ `maxAgePreference:${args.maxAgePreference},`)
            !!args.pics && (query = query+ `pics:[${args.pics.map(pic => `"${pic}"`)}],`)

            query = query.slice(-1) === ','? query.slice(0,-1) : query;

            query = query + `}) RETURN a`;
            console.log('query: ',query);
            return session
                .run(query)
                .then(result => {
                    console.log('result: ',result);
                    return result.records
                })
                .then(records => records[0]._fields[0].properties)
                .catch(e => console.log('newUser error: ',e))
        },
        newMessage: async (_,args) => {
            console.log('in newMessage resolver');
            console.log('args: ',args);
            const message = {
                _id: args._id,
                name: args.name,
                text: args.text,
                avatar: args.avatar,
                createdAt: new Date(),
                order: args.order,
                uid: args.uid,
                //createdAt: moment().format('MMMM Do YYYY, h:mm:ss a')
            };

            console.log('message: ',message);

            try {
                await db.collection(`matches/${args.matchId}/messages`).add(message);
            } catch(e) {
                console.error(`error writing new message to ${args.matchId}: ${e}`);
                return null;
            }

            // Call our subscription asynchronously so we don't slow down our client.
            const asyncFunc = async () => {
                console.log('in pubsub async');
                console.log('args.matchId: ',args.matchId);
                console.log('message: ',message);
                console.log('sub tag: ',NEW_MESSAGE);
                pubsub.publish(NEW_MESSAGE, { newMessageSub: {message, matchId: args.matchId}})
            }
            asyncFunc();

            console.log(`${args.name} posted message to matchId ${args.matchId}`)

            return message;

        },
        bid: (_,args) => {
            const datetimeOfBid = Date.now();
            let query = `MATCH (a:User {id:'${args.id}'}), (d:Date {id:'${args.dateId}'}) 
                MERGE (a)-[r:BID{datetimeOfBid: '${datetimeOfBid}',`;
                !!args.bidPlace && (query = query+ `bidPlace:'${args.bidPlace}',`) +
                !!args.bidDescription && (query = query+ `bidDescription:'${args.bidDescription}',`);
            query = query.slice(-1) === ','? query.slice(0,-1) : query;
                
            query = query + `}]->(d) RETURN a,d,r`;

            console.log('query in bid: ',query);

            return session
                .run(query)
                .then(result => {
                    return result.records[0]
                })
                .then(record => ({
                    id: record._fields[1].id,
                    datetimeOfBid: record._fields[2].dateTimeOfBid,
                    bidDescription: record._fields[2].bidDescription,
                    bidPlace: record._fields[2].bidPlace,
                }))
                .catch(e => console.log('bid mutation error: ',e))
        },
        follow: (_,args) => {
            const query = `MATCH (a:User {id:'${args.id}'}), (b:User {id:'${args.followId}'}) MERGE (a)-[r:FOLLOW}]->(b) RETURN b`;

            return session
                .run(query)
                .then(result => {
                    return result.records[0]
                })
                .then(record => record.fields[0].properties)
                .catch(e => console.log('follow mutation error: ',e))
        },
        createDate: (_,args) => {
            const creationTime = Date.now();
            const dateId = uuid();

            let query = `CREATE (d:Date {id:'${dateId}',creator:'${args.id}',creationTime:'${creationTime}'`; 
                !!args.datetimeOfDate && (query = query+ `datetimeOfDate:'${args.datetimeOfDate}',`) +
                !!args.description && (query = query+ `description:'${args.description}',`);
            
            query = query.slice(-1) === ','? query.slice(0,-1) : query;    
            query = query + `}) RETURN d`;

            console.log('query in bid: ',query);

            return session
                .run(query)
                .then(result => result.records[0])
                .then(record => record._fields[0].properties)
                .catch(e => console.log('bid mutation error: ',e))
        },
        chooseWinner: async (_,args) => {
            const {id, winnerId, dateId} = args;

            let date;

            // Update neo4j values
            try {
                date = await session.run(`MATCH (a:User{id:'${id}'})-[:CREATE]->(d:Date{id:${args.dateId}})<-[r:BID]-(b:User{b:${winnerId}}) 
                    SET r.winner=TRUE,
                    d.winner='${winnerId}',
                    d.open=FALSE
                    return d`)
            } catch(e) {
                console.error('Error updating winner value on bid ${}');
                return null;
            }

            // Create new document in Firestore for match
            try {
                await db.collection(`matches`).doc(dateId).set({
                    user1: id,
                    user2: winnerId,
                    matchTime: Date.now(),
                })
            } catch(e) {
                console.error(`chooseWinner error updating Firestore: ${e}`);
                return null;
            }
            return date.result.records[0].fields[0].properties;
        },
    }
}

export default resolvers;