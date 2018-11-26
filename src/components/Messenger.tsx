import React, { Component } from 'react';
import {
  View, StyleSheet, ViewStyle, TextStyle,
} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { NavigationScreenProp, NavigationRoute } from 'react-navigation';
import { GET_MESSAGES } from '../apollo/queries';
import { getCurrentTime } from '../format';

interface Params {}

interface Props {
  subscribeToNewMessages: () => void;
  newMessage: any;
  pic: string;
  name: string;
  matchId: string;
  otherId: string;
  fetchMoreMessages: () => void;
  id: string;
  messages: any[];
  cursor: number;
  navigation: NavigationScreenProp<NavigationRoute<Params>, Params>;
}

interface State {
  unsubscribe: () => void;
}

class Messenger extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      unsubscribe: () => null,
    };
  }

  // While in the chat window, listen for chat updates
  componentDidMount = () => {
    const { subscribeToNewMessages } = this.props;
    this.unsubscribe = subscribeToNewMessages();
  };

  // Stop listening for new messages when the chat window is not up.
  componentWillUnmount = () => this.unsubscribe();

  // This function is called when a new message is sent.
  sendNewMessage = (messages: any[]) => {
    console.log('in sendNewMessage');
    console.log('messages: ', messages);

    // If messages is array, we may need to change
    const now = getCurrentTime();
    const {
      newMessage, pic, name, matchId, otherId,
    } = this.props;

    // We are currently only sending 1 message at a time, but since RN Gifted Chat sends us an
    // array, we process it using a forEac method
    messages.forEach(message => newMessage({
      variables: {
        avatar: pic,
        name,
        uid: message.user._id,
        // id: now,
        matchId,
        // The message object returns an array.
        text: message.text,
        _id: message._id,
        order: -1 * now,
        receiverId: otherId,
      },
      // OptimisticResponse is processed by update as soon
      // as a message is sent by the newMessage above. When
      // the mutation's response comes back, update is re-ran with the real response.
      // Apollo knows which entry to update by the _id field assigned to the message.
      optimisticResponse: {
        __typename: 'Mutation',
        newMessage: {
          avatar: pic,
          name,
          uid: message.user._id,
          matchId,
          text: message.text,
          order: -1 * now,
          _id: message._id,
          __typename: 'MessageItem',
          createdAt: now,
        },
      },
      // function is used to update our cache with the mutation response
      update: (store: any, data: any) => {
        // Read the cache
        const storeData = store.readQuery({
          query: GET_MESSAGES,
          variables: { id: matchId },
        });

        // unshift() places the value in the front of the array.
        storeData.messages.list.unshift(data.data.newMessage);

        // Write back into the cache with the new message.
        store.writeQuery({ query: GET_MESSAGES, data: storeData });
      },
    }));
  };

  render() {
    const {
      fetchMoreMessages,
      id,
      name,
      messages,
      pic,
      cursor,
      navigation: { navigate },
    } = this.props;

    return (
      <View style={styles.messengerContainer}>
        <GiftedChat
          messages={messages}
          onSend={message => this.sendNewMessage(message)}
          user={{ _id: `${id}`, name, avatar: pic }}
          showUserAvatar={false}
          onPressAvatar={user => navigate('UserProfile', { id: user._id, name: user.name, hostId: id })
          }
          // The following 3 variables relate to pagination.
          loadEarlier={!!cursor}
          onLoadEarlier={() => fetchMoreMessages()}
          isLoadingEarlier
          imageStyle={styles.imageStyle as ViewStyle}
        />
      </View>
    );
  }
}

interface Style {
  messengerContainer: ViewStyle;
  textHeader: TextStyle;
  headerViewStyle: ViewStyle;
  imageStyle: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  messengerContainer: {
    flex: 1,
    alignItems: 'stretch',
    marginLeft: 0,
    marginRight: 0,
    backgroundColor: '#FFF',
  },
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
  imageStyle: {},
});

export default Messenger;
