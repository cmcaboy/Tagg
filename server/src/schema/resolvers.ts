import {driver} from '../db/neo4j';
import {db} from '../db/firestore';
import {getQueue} from '../middleware/queue';
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
            // Should sort by date?
            console.log('otherBids args: ',args);
            return session
                    .run(`MATCH(b:User)-[r:BID]->(d:Date{id:'${args.id}'}) RETURN b,d,r`)
                        .then(result => result.records)
                        .then(records => {
                            const list = records.map(record => ({
                                id: args.id,
                                datetimeOfBid: record._fields[2].datetimeOfBid,
                                bidDescription: record._fields[2].bidDescription,
                                bidPlace: record._fields[2].bidPlace,
                                user: {
                                    ...record._fields[0].properties,
                                    profilePic: !!record._fields[0].properties.pics? record._fields[0].properties.pics[0]: null,
                                }
                            }))
                            return {
                                list,
                                cursor: null,
                            }
                        )
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

            let followQuery;

            switch(args.followerDisplay) {
                case "Following Only":
                    followQuery=`AND isFollowing`;
                    break;
                case "Non-Following Only":
                    followQuery=`AND NOT isFollowing`;
                    break;
                default:
                    followQuery=``;
            }


            if(!args.cursor) {
                console.log('No cursor passed in. You must be at the end of the list. No more values to retreive.');
                return {
                    list: [],
                    cursor: null,
                    id: `${args.id}q`,
                }
            } else if (!args.id) {
                console.error('Error! No id passed in!');
            }

            return session.run(`MATCH(a:User{id:'${args.id}'}),(b:User) 
                WITH a,b, size((b)<-[:FOLLOWING]-()) as num_likes,
                ((distance(point(a),point(b))*0.000621371)*(1/toFloat((SIZE((b)<-[:FOLLOWING]-())+1)))) as order,
                distance(point(a),point(b))*0.000621371 as distanceApart,
                exists((a)-[:FOLLOWING]->(b)) as isFollowing,
                exists((b)-[:CREATE]->(:Date{open:TRUE})) as hasDateOpen
                where
                NOT b.id=a.id AND
                NOT b.gender=a.gender AND
                distanceApart < a.distance AND
                order > ${args.cursor}
                ${followQuery}
                RETURN b, distanceApart, num_likes, order, isFollowing, hasDateOpen
                ORDER BY order
                LIMIT ${QUEUE_PAGE_LENGTH}`)
                .then(result => result.records)
                .then(records => {
                    const list = records.map(record => {
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
                            id: `${args.id}q`,
                        }
                    }

                    const newCursor = list.length >= QUEUE_PAGE_LENGTH ? list[list.length - 1].order : null;

                    return {
                        list,
                        cursor: newCursor,
                        id: `${args.id}q`,
                    }
                }
                )
                .catch(e => console.log('moreQueue error: ',e))           
        },
        moreDates: (_,args) => {},
        moreDateBids: (_,args) => {},
        moreFollowing: (_,args) => {},
        date: (_,args) => {
            return session
            .run(`MATCH(d:Date{id:'${args.id}'}) 
                RETURN d`)
                .then(result => result.records[0])
                .then(record => record._fields[0].properties)
                .catch(e => {
                    console.log('dateRequest error: ',e);
                    return null;
                })
        },

    },
    User: {
        following: (parentValue, _) => {
            // Need to factor in pagination
            console.log('following parentValue: ',parentValue);
                return session
                    .run(`MATCH(a:User{id:'${parentValue.id}'})-[r:FOLLOWING]->(b:User) 
                        WITH a,r,b, 
                        exists((b)-[:CREATE]->(:Date{open:TRUE})) as hasDateOpen
                        RETURN b,hasDateOpen`)
                        .then(result => result.records)
                        .then(records => {
                            console.log('following records: ',records);
                            const list = records.map(record => ({
                                ...record._fields[0].properties,
                                hasDateOpen: record._fields[1]
                            }))
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
                    .run(`MATCH(a:User{id:'${parentValue.id}'})-[r:BID]->(d:Date)<-[:CREATE]-(b:User) RETURN b,d,r`)
                        .then(result => result.records)
                        .then(records => {
                            console.log('bids records: ',records);
                            const list = records.map(record => ({
                                ...record._fields[2].properties,
                                id: record._fields[1].properties.id,
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
            console.log('dateRequests parentValue: ',parentValue);
            return session
                .run(`MATCH(a:User{id:'${parentValue.id}'})-[:CREATE]->(d:Date) 
                    WITH a, d, size((d)<-[:BID]-(:User)) as num_bids
                    RETURN a,d,num_bids`)
                    .then(result => result.records)
                    .then(records => {
                        console.log('dateRequests records: ',records);
                        const list = records.map(record => ({
                            id: record._fields[1].properties.id,
                            creator: record._fields[0].properties,
                            creationTime: record._fields[1].properties.creationTime,
                            datetimeOfDate: record._fields[1].properties.datetimeOfDate,
                            description: record._fields[1].properties.description,
                            num_bids: record._fields[2],
                            open: record._fields[1].properties.open,
                        }))
                        console.log('dateRequests list: ',list);
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
            console.log('queue');
            return getQueue(parentValue);
        },
    },
    DateItem: {
        bids: (parentValue, _) => {
            return session
                .run(`MATCH(b:User)-[r:BID]->(d:Date{id:'${parentValue.id}'}) RETURN r`)
                    .then(result => result.records)
                    .then(records => {
                        const list = records.map(record => ({
                            ...record._fields[0].properties,
                    }))
                        return {
                            list,
                            cursor: null,
                        }
                    })
                    .catch(e => console.log('bid error: ',e))
        },
        num_bids: (parentValue, _) => {
            return session
                .run(`MATCH(d:Date{id:'${parentValue.id}'})
                    WITH size((d)<-[:BID]-(:User)) as num_bids
                    return num_bids`)
                    .then(result => result.records[0])
                    .then(record => record._fields[0])
                    .catch(e => console.log('num_bids error: ',e))
        },
        creator: (parentValue, _) => {
            return session
                .run(`MATCH(a:User)-[:CREATE]->(d:Date{id:'${parentValue.id}'})
                    RETURN a`)
                    .then(result => result.records[0])
                    .then(record => record._fields[0].properties)
                    .catch(e => console.log('creator error: ',e))
        },
        winner: (parentValue, _) => {
            return session
                .run(`MATCH(d:Date{id:'${parentValue.id}'})<-[r:BID{winner:TRUE}]-(b:User)
                    RETURN b`)
                    .then(result => result.records[0])
                    .then(record => record._fields[0].properties)
                    .catch(e => console.log('winner error: ',e))
        },
    },
    DateBid: {
        dateUser: (parentValue, _) => {
            return session
                .run(`MATCH(a:User)-[:CREATE]->(d:Date)<-[r:BID{id:'${parentValue.id}'}]-(b:User)
                    RETURN a`)
                    .then(result => result.records[0])
                    .then(record => record._fields[0].properties)
                    .catch(e => console.log('winner error: ',e))
        },
        bidUser: (parentValue, _) => {
            return session
                .run(`MATCH(a:User)-[:CREATE]->(d:Date)<-[r:BID{id:'${parentValue.id}'}]-(b:User)
                    RETURN b`)
                    .then(result => result.records[0])
                    .then(record => record._fields[0].properties)
                    .catch(e => console.log('winner error: ',e))
        },
        date: (parentValue, _) => {
            return session
                .run(`MATCH(a:User)-[:CREATE]->(d:Date)<-[r:BID{id:'${parentValue.id}'}]-(b:User)
                    RETURN d`)
                    .then(result => result.records[0])
                    .then(record => record._fields[0].properties)
                    .catch(e => console.log('winner error: ',e))
        },
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
            !!args.description && (query = query+ `a.description="${args.description}",`)
            !!args.school && (query = query+ `a.school="${args.school}",`)
            !!args.work && (query = query+ `a.work="${args.work}",`)
            !!args.token && (query = query+ `a.token='${args.token}',`)
            !!args.registerDateTime && (query = query+ `a.registerDateTime='${args.registerDateTime}',`)
            isBoolean(args.sendNotifications) && (query = query+ `a.sendNotifications=${args.sendNotifications},`)
            !!args.distance && (query = query+ `a.distance=${args.distance},`)
            !!args.latitude && (query = query+ `a.latitude=${args.latitude},`)
            !!args.longitude && (query = query+ `a.longitude=${args.longitude},`)
            !!args.minAgePreference && (query = query+ `a.minAgePreference=${args.minAgePreference},`)
            !!args.maxAgePreference && (query = query+ `a.maxAgePreference=${args.maxAgePreference},`)
            !!args.followerDisplay && (query = query+ `a.followerDisplay='${args.followerDisplay}',`)
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
        editUserQueue: async (_,args) => {
            const isBoolean = val => 'boolean' === typeof val;
            console.log('args: ',args);
            let query = `MATCH(a:User{id: '${args.id}'}) SET `;
            isBoolean(args.sendNotifications) && (query = query+ `a.sendNotifications=${args.sendNotifications},`)
            !!args.distance && (query = query+ `a.distance=${args.distance},`)
            !!args.minAgePreference && (query = query+ `a.minAgePreference=${args.minAgePreference},`)
            !!args.maxAgePreference && (query = query+ `a.maxAgePreference=${args.maxAgePreference},`)

            query = query.slice(-1) === ','? query.slice(0,-1) : query;
            query = query + ` RETURN a`;
            console.log('query: ',query);
            
            try {
                await session.run(query)
            } catch(e) {
                console.log('editUserQueue error: ',e);
                return null;
            } 
            let result
            try {
                result = await getQueue(args.id);
            } catch(e) {
                console.log('editUserQueue error: ',e);
                return null;
            }
            return result;
             
        },
        newUser: (_,args) => {
            console.log('args: ',args);
            let query = `CREATE(a:User{
                id: '${args.id}',
                name: '${args.name}',
                active: ${args.active},
                email: '${args.email}',
                gender: '${args.gender}',`;
            !!args.age && (query = query+ `age:${args.age},`)
            !!args.description && (query = query+ `description:"${args.description}",`)
            !!args.school && (query = query+ `school:"${args.school}",`)
            !!args.work && (query = query+ `work:"${args.work}",`)
            !!args.token && (query = query+ `token:'${args.token}',`)
            !!args.registerDateTime && (query = query+ `registerDateTime:'${args.registerDateTime}',`)
            !!args.sendNotifications && (query = query+ `sendNotifications:${args.sendNotifications},`)
            !!args.distance && (query = query+ `distance:${args.distance},`)
            !!args.latitude && (query = query+ `latitude:${args.latitude},`)
            !!args.longitude && (query = query+ `longitude:${args.longitude},`)
            !!args.minAgePreference && (query = query+ `minAgePreference:${args.minAgePreference},`)
            !!args.maxAgePreference && (query = query+ `maxAgePreference:${args.maxAgePreference},`)
            !!args.followerDisplay && (query = query+ `followerDisplay='${args.followerDisplay}',`)
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
            // Need to make sure client cannot input doublequote ("). It will break the query.
            const datetimeOfBid = Date.now();
            const bidId = uuid();

            let query = `MATCH (a:User {id:'${args.id}'}), (d:Date {id:'${args.dateId}'}) 
                MERGE (a)-[r:BID{id: '${bidId}',datetimeOfBid: '${datetimeOfBid}',`;
                !!args.bidPlace && (query = query+ `bidPlace:"${args.bidPlace}",`) +
                !!args.bidDescription && (query = query+ `bidDescription:"${args.bidDescription}",`);
            query = query.slice(-1) === ','? query.slice(0,-1) : query;
                
            query = query + `}]->(d) RETURN r`;

            console.log('query in bid: ',query);

            return session
                .run(query)
                .then(result => {
                    return result.records[0]
                })
                .then(record => ({
                    ...record._fields[0].properties,
                }))
                .catch(e => console.log('bid mutation error: ',e))
        },
        follow: (_,args) => {
            // supports both follow and unfollow
            let query;
            const {isFollowing, id, followId} = args;

            console.log('follow start');
            console.log('args: ',args);
            console.log('isFollowing: ',isFollowing);
            console.log('followId: ',followId);
            console.log('id: ',id);

            if(isFollowing) {
                query = `MATCH (a:User {id:'${id}'}), (b:User {id:'${followId}'}) MERGE (a)-[r:FOLLOWING]->(b) RETURN b`;
            } else {
                query = `MATCH (a:User {id:'${id}'})-[r:FOLLOWING]->(b:User {id:'${followId}'}) DELETE r RETURN b`;
            }

            console.log('query: ',query)

            return session
                .run(query)
                .then(result => {
                    console.log('result: ',result);
                    return result.records[0]
                })
                .then(record => ({...record._fields[0].properties,isFollowing}))
                .catch(e => console.log('follow mutation error: ',e))
        },
        unFollow: (_,args) => {
            const query = `MATCH (a:User {id:'${args.id}'})-[r:FOLLOWING]->(b:User {id:'${args.unFollowId}'}) DELETE r RETURN b`;

            return session
                .run(query)
                .then(result => {
                    return result.records[0]
                })
                .then(record => ({...record._fields[0].properties,isFollowing: false}))
                .catch(e => console.log('follow mutation error: ',e))
        },
        createDate: async (_,args) => {
            // Currently, I am only creating the node field, but I also need to create the :CREATE relationship

            const creationTime = Date.now();
            const dateId = uuid();

            let query = `CREATE (d:Date {id:'${dateId}',creator:'${args.id}',creationTime:'${creationTime}',open:FALSE,`; 
                !!args.datetimeOfDate && (query = query+ `datetimeOfDate:"${args.datetimeOfDate}",`) +
                !!args.description && (query = query+ `description:"${args.description}",`);
            
            query = query.slice(-1) === ','? query.slice(0,-1) : query;    
            query = query + `}) RETURN d`;

            console.log('query in createDate: ',query);

            let rawDate;
            let date;

            // In order to create a new date, we need to create a date node and a :CREATE relationship between
            // the date creator and the new date node.
            try {
                rawDate = await session.run(query);
                date = rawDate.records[0]._fields[0].properties;
            } catch(e){
                console.log('createDate mutation error d node: ',e);
                return null;
            }
            try {
                await session.run(`MATCH (a:User {id:'${args.id}'}), (d:Date {id:'${dateId}'}) MERGE (a)-[r:CREATE]->(d)`)
            } catch(e) {
                console.log('createDate mutation error relationship create: ',e);
                return null;
            }
            return date;
        },
        chooseWinner: async (_,args) => {
            // In order to create a winner, we need to set winner=true on the bid, set open to FALSE on the date
            // Then we need to create a new document in the Firestore database, which will store messages between the
            // two.
            const {id, winnerId, dateId} = args;
            
            let date;

            // Update neo4j values
            try {
                const data = await session.run(`MATCH (a:User{id:'${id}'})-[:CREATE]->(d:Date{id:'${dateId}'})<-[r:BID]-(b:User{id:'${winnerId}'}) 
                    WITH d,a,b,r
                    SET r.winner=TRUE,
                    d.winner='${winnerId}',
                    d.open=FALSE
                    return d,a,b`)
                date = {
                    ...data.records[0]._fields[0].properties,
                    creator: data.records[0]._fields[1].properties,
                    winner: data.records[0]._fields[2].properties,
                    //num_bids: data.records[0]._fields[3],
                }

            } catch(e) {
                console.error('Error updating winner value on bid: ',e);
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
            //console.log('chooseWinner date: ',date);
            return date;
        },
    }
}

export default resolvers;