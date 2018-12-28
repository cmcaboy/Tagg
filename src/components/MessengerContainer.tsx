import React, { Component } from 'react';
import {
  View, TouchableOpacity, StyleSheet, ViewStyle, TextStyle,
} from 'react-native';
import { Query, Mutation } from 'react-apollo';
import { NavigationScreenProp, NavigationRoute } from 'react-navigation';
import {
  CirclePicture, MyAppText, Spinner, ErrorMessage,
} from './common';
import Messenger from './Messenger';
import { GET_NEW_MESSAGES } from '../apollo/subscriptions';
import { SEND_MESSAGE } from '../apollo/mutations';
import { GET_MESSAGES, MORE_MESSAGES } from '../apollo/queries';
import { sendMessage, sendMessageVariables } from '../apollo/mutations/__generated__/sendMessage';
// import { getMessages, getMessagesVariables } from '../apollo/queries/__generated__/getMessages';
import FlagMenu from './common/FlagMenu';
import { analytics } from '../firebase';

// class GetMessages extends Query<getMessages, getMessagesVariables> {};
class GetMessages extends Query<any, any> {}
class SendMessage extends Mutation<sendMessage, sendMessageVariables> {}

interface Params {
  otherId?: string;
  otherName: string;
  otherPic: string;
  id: string;
  matchId: string;
  name: string;
  pic: string;
}

interface Props {
  navigation: NavigationScreenProp<NavigationRoute<Params>, Params>;
}

interface State {}

class MessengerContainer extends Component<Props, State> {
  static navigationOptions = ({
    navigation,
    navigation: {
      state: {
        params: { otherId: id, otherName: name, id: hostId },
      },
    },
  }: {
  navigation: NavigationScreenProp<NavigationRoute<Params>, Params>;
  }) => ({
    // title: `${navigation.state.params.otherName}`,
    headerTitle: (
      <View style={styles.headerViewStyle}>
        {console.log('navigation params: ', navigation.state.params)}
        <TouchableOpacity
          onPress={() => {
            analytics.logEvent('Click_Messenger_heading_circlePicture');
            return navigation.navigate('UserProfile', {
              id,
              name,
              hostId,
            })
          }}
        >
          <CirclePicture imageURL={navigation.state.params.otherPic} picSize="mini" />
        </TouchableOpacity>
        <MyAppText style={styles.textHeader}>{`${navigation.state.params.otherName}`}</MyAppText>
        <View style={{ width: 30 }} />
      </View>
    ),
    headerRight: <FlagMenu navigation={navigation} name={name} id={id} hostId={hostId} size={22} />,
    headerTitleStyle: {
      alignSelf: 'center',
      textAlign: 'center',
      fontWeight: 'normal',
      fontSize: 22,
      color: 'black',
    },
  });

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
      <GetMessages
        query={GET_MESSAGES}
        // fetchPolicy can be set to no-cache or network-only if we want to force a refetch
        // each time when entering a chat.
        // fetchPolicy='network-only'
        variables={{
          id: matchId,
        }}
      >
        {({
          loading, error, data, subscribeToMore, fetchMore, refetch,
        }) => {
          if (loading) return <Spinner />;
          if (error) return <ErrorMessage error={error.message} refetch={refetch} />;
          console.log('messages container data: ', data);

          // We have to change the format of our messages in order to satisfy RN Gifted Chat
          const messages = data.messages.list.map((message: any) => ({
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
            <SendMessage mutation={SEND_MESSAGE} ignoreResults={false}>
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
                    analytics.logEvent('Event_fetchMoreMessages');
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
                        analytics.logEvent('Event_Messenger_newMessageReceived')
                        return newSubMessages;
                      },
                    });
                  }}
                />
              )}
            </SendMessage>
          );
        }}
      </GetMessages>
    );
  }
}

interface Style {
  textHeader: TextStyle;
  headerViewStyle: ViewStyle;
}

const styles = StyleSheet.create<Style>({
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
  },
});

export default MessengerContainer;
