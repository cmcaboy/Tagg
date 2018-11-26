import React, { SFC } from 'react';
import {
  View, TouchableOpacity, StyleSheet, ViewStyle, TextStyle,
} from 'react-native';
import { CirclePicture, MyAppText } from './common';

interface Props {
  name: string;
  picture: string;
  onPress: () => any;
  lastMessage?: string;
}

interface Style {
  itemContainer: ViewStyle;
  textContainer: ViewStyle;
  lastMessage: TextStyle;
}

const MatchListItem: SFC<Props> = ({
  name, picture, onPress, lastMessage = 'test',
}) => {
  console.log('last message');
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.itemContainer}>
        <CirclePicture imageURL={picture} picSize="small" />
        <View style={styles.textContainer}>
          <MyAppText>{name}</MyAppText>
          <MyAppText style={styles.lastMessage}>{lastMessage}</MyAppText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create<Style>({
  itemContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 5,
    // alignItems: 'stretch'
  },
  textContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: 5,
  },
  lastMessage: {
    opacity: 0.7,
    fontSize: 10,
  },
});

export default MatchListItem;
