import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Platform, Image } from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import {db} from '../firebase';
import {CirclePicture,MyAppText,Spinner} from './common';
import {Query,Mutation} from 'react-apollo';
import Messenger from './Messenger';
import gql from 'graphql-tag';
import {GET_NEW_MESSAGES} from '../apollo/subscriptions';
import {SEND_MESSAGE} from '../apollo/mutations';
import {GET_MESSAGES,MORE_MESSAGES} from '../apollo/queries';

class MessengerContainer extends Component {
    
    constructor(props) {
        super(props);
    }

    static navigationOptions = ({navigation}) => ({
        title: `${navigation.state.params.otherName}`,
        headerTitle: (
            <View style={styles.headerViewStyle}>
                {console.log('navigation params: ',navigation.state.params)}
                <TouchableOpacity onPress={() => navigation.navigate('UserProfile',
                    {id:navigation.state.params.otherId,name:navigation.state.params.otherName})}>
                    <CirclePicture imageURL={navigation.state.params.otherPic} picSize="mini" />
                </TouchableOpacity>
                <MyAppText style={styles.textHeader}>{navigation.state.params.otherName}</MyAppText>
                <View style={{width: 100}}></View>
            </View>
        ),
        headerTitleStyle: 
            {
                alignSelf: 'center',
                textAlign: 'center',
                fontWeight:'normal',
                fontSize: 22,
                color: 'black'
            }
    })
    
    render() {
        return (
            <Query 
                query={GET_MESSAGES} 
                // fetchPolicy can be set to no-cache or network-only if we want to force a refetch
                // each time when entering a chat.
                //fetchPolicy='network-only'
                variables={{
                    id: this.props.navigation.state.params.matchId,
                }}
            >
                {({loading, error, data, subscribeToMore, fetchMore}) => {
                    if(loading) return <Spinner />
                    if(error) return <Text>Error! {error.message}</Text>
                    console.log('messages container data: ',data);

                    // We have to change the format of our messages in order to satisfy RN Gifted Chat
                    const messages = data.messages.list.map(message => {
                        return {
                            _id: message._id,
                            text: message.text,
                            createdAt: message.createdAt,
                            order: message.order,
                            user: {
                                name: message.name,
                                avatar: message.avatar,
                                _id: message.uid,
                            },
                        }
                    });

                    return (
                        <Mutation mutation={SEND_MESSAGE} ignoreResults={false}>
                        {(newMessage,_) => {
                            return (
                                <Messenger 
                                    messages={messages}
                                    newMessage={newMessage}
                                    id={this.props.navigation.state.params.id}
                                    otherId={this.props.navigation.state.params.otherId}
                                    matchId={this.props.navigation.state.params.matchId}
                                    name={this.props.navigation.state.params.name}
                                    pic={this.props.navigation.state.params.pic}
                                    navigation={this.props.navigation}
                                    cursor={data.messages.cursor}
                                    fetchMoreMessages={() => {
                                        // This method is used for pagination. Our initial query only returns 20 messages. If
                                        // more messages are needed, this function is called and 20 more are received.
                                        console.log('in fetchMoreMessages');
                                        return fetchMore({
                                            query: MORE_MESSAGES,
                                            variables: {
                                                id: this.props.navigation.state.params.matchId, 
                                                cursor: data.messages.cursor,
                                            },
                                            updateQuery: (prev, { fetchMoreResult }) => {
                                                console.log('fetchMore updateQuery');

                                                let newMessages = fetchMoreResult.moreMessages.list;
                                                const newCursor = fetchMoreResult.moreMessages.cursor;

                                                // Append the new messages to the existing query result
                                                const messages = {
                                                    messages: {
                                                        id: prev.messages.id,
                                                        cursor: newCursor,
                                                        list: [...prev.messages.list,...newMessages],
                                                        __typename: 'Message',
                                                    },
                                                }
                                                console.log('fetchMore New Result: ',messages);
                                                return messages;
                                            }
                                        })
                                    }}
                                    subscribeToNewMessages={() => {
                                        // We are only listening to new messages from the other user. For messages
                                        // that we send, we are using the mutation reponse along with optimisticResponse.
                                        console.log('in subscribeToNewMessages');
                                        return subscribeToMore({
                                            document: GET_NEW_MESSAGES,
                                            variables: {
                                                matchId: this.props.navigation.state.params.matchId, 
                                                id: this.props.navigation.state.params.id
                                            },
                                            // The subscription payload is received as the second parameter to updateQuery.
                                            // We destructure the payload and merge it with the existing query.
                                            updateQuery: (prev, { subscriptionData }) => {
                                                if(!subscriptionData.data) return prev;
                                                console.log('subscriptionData.data: ',subscriptionData.data);
                                                const newMessage = subscriptionData.data.newMessageSub;

                                                // You must return an object that has the same structure as what the query
                                                // component returns.
                                                const messages = {
                                                    messages: {
                                                        id: prev.messages.id,
                                                        cursor: prev.messages.cursor,
                                                        list: [newMessage,...prev.messages.list],
                                                        __typename: 'Message',
                                                    },
                                                }
                                                return messages;
                                            } 
                                        })
                                    }
                                    }
                                 />
                            )
                        }}
                        </Mutation>
                    )
                }}
            </Query>
        )
    }
}

const styles = StyleSheet.create({
    textHeader: {
        alignSelf: 'center',
        textAlign: 'center',
        fontWeight:'bold',
        fontSize: 18,
        color: '#000',
        paddingLeft: 8
    },
    headerViewStyle: {
        flexDirection: 'row',
        paddingVertical: 5
    }
});


export default MessengerContainer;