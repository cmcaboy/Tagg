import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Query, Mutation } from 'react-apollo';
import { CirclePicture, MyAppText, Spinner, ErrorMessage } from './common';
import Messenger from './Messenger';
import { GET_NEW_MESSAGES } from '../apollo/subscriptions';
import { SEND_MESSAGE } from '../apollo/mutations';
import { GET_MESSAGES, MORE_MESSAGES } from '../apollo/queries';

class MessengerContainer extends Component {
  static navigationOptions = ({ navigation }) => ({
      // title: `${navigation.state.params.otherName}`,
      headerTitle: (
        <View style={styles.headerViewStyle}>
          {console.log('navigation params: ', navigation.state.params)}
          <TouchableOpacity onPress={() => navigation.navigate('UserProfile',
            {
              id: navigation.state.params.otherId,
              name: navigation.state.params.otherName,
              hostId: navigation.state.params.id,
            })}
          >
            <CirclePicture imageURL={navigation.state.params.otherPic} picSize="mini" />
          </TouchableOpacity>
          <MyAppText style={styles.textHeader}>
            {`${navigation.state.params.otherName}`}
          </MyAppText>
          <View style={{ width: 30 }} />
        </View>
      ),
      headerTitleStyle: {
        alignSelf: 'center',
        textAlign: 'center',
        fontWeight: 'normal',
        fontSize: 22,
        color: 'black',
      },
  })

  render() {
    const {
      navigation,
      navigation: {
        state: {
          params: {
            matchId, id, otherId, name, pic,
          },
        },
      },
    } = this.props;

    return (
        <Query
          query={GET_MESSAGES}
          // fetchPolicy can be set to no-cache or network-only if we want to force a refetch
          // each time when entering a chat.
          // fetchPolicy='network-only'
          variables={{
              id: matchId,
          }}
        >
          {({ loading, error, data, subscribeToMore, fetchMore }) => {
              if (loading) return <Spinner />;
              if (error) return <ErrorMessage error={error.message} />;
              console.log('messages container data: ', data);

              // We have to change the format of our messages in order to satisfy RN Gifted Chat
              const messages = data.messages.list.map(message => ({
                _id: message._id,
                text: message.text,
                createdAt: message.createdAt,
                order: message.order,
                user: {
                  name: message.name,
                  avatar: message.avatar,
                  _id: message.uid,
                },
              }));

              return (
                <Mutation mutation={SEND_MESSAGE} ignoreResults={false}>
                  {newMessage => (
                    <Messenger
                      messages={messages}
                      newMessage={newMessage}
                      id={id}
                      otherId={otherId}
                      matchId={matchId}
                      name={name}
                      pic={pic}
                      navigation={navigation}
                      cursor={data.messages.cursor}
                      fetchMoreMessages={() => {
                        // This method is used for pagination. Our initial query only returns 20 messages. If
                        // more messages are needed, this function is called and 20 more are received.
                        console.log('in fetchMoreMessages');
                        return fetchMore({
                          query: MORE_MESSAGES,
                          variables: {
                            id: matchId,
                            cursor: data.messages.cursor,
                          },
                          updateQuery: (prev, { fetchMoreResult }) => {
                            console.log('fetchMore updateQuery');

                            const newMessages = fetchMoreResult.moreMessages.list;
                            const newCursor = fetchMoreResult.moreMessages.cursor;

                            // Append the new messages to the existing query result
                            const newFetchMessages = {
                              messages: {
                                id: prev.messages.id,
                                cursor: newCursor,
                                list: [...prev.messages.list, ...newMessages],
                                __typename: 'Message',
                              },
                            };
                            console.log('fetchMore New Result: ', newFetchMessages);
                            return newFetchMessages;
                          },
                        });
                      }}
                      subscribeToNewMessages={() => {
                        // We are only listening to new messages from the other user. For messages
                        // that we send, we are using the mutation reponse along with optimisticResponse.
                        console.log('in subscribeToNewMessages');
                        return subscribeToMore({
                          document: GET_NEW_MESSAGES,
                          variables: {
                            matchId,
                            id,
                          },
                          // The subscription payload is received as the second parameter to updateQuery.
                          // We destructure the payload and merge it with the existing query.
                          updateQuery: (prev, { subscriptionData }) => {
                            if (!subscriptionData.data) return prev;
                            console.log('subscriptionData.data: ', subscriptionData.data);
                            const newSubMessage = subscriptionData.data.newMessageSub;

                            // You must return an object that has the same structure as what the query
                            // component returns.
                            const newSubMessages = {
                              messages: {
                                id: prev.messages.id,
                                cursor: prev.messages.cursor,
                                list: [newSubMessage, ...prev.messages.list],
                                __typename: 'Message',
                              },
                            };
                            return newSubMessages;
                          },
                        });
                      }}
                    />
                  )}
                </Mutation>
              );
          }}
        </Query>
    );
  }
}

const styles = StyleSheet.create({
    textHeader: {
        alignSelf: 'center',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18,
        color: '#000',
        paddingLeft: 8,
    },
    headerViewStyle: {
        flexDirection: 'row',
        paddingVertical: 5,
    }
});


export default MessengerContainer;
