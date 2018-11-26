import React, { SFC } from 'react';
import {
  View, TouchableOpacity, StyleSheet, ViewStyle, TextStyle,
} from 'react-native';
import { MyAppText, HeaderCard } from './common';

interface Props {
  flipNewDateModal: () => void;
  flipFilterModal: () => void;
}

interface Style {
  header: ViewStyle;
  textStyle: TextStyle;
  overRide: ViewStyle;
  headerItem: ViewStyle;
}

const StaggHeader: SFC<Props> = ({ flipNewDateModal, flipFilterModal }) => {
  // Takes the following props
  // -------------------------
  // onFollow() = function executed when user clicks follow button
  // onUnfollow() = function executed when user clicks on following button
  // user = object containing user information: name, age, distanceApart, school, work, profilePic
  // navigation = react navigation object
  // isFollowing = boolean that indicates whether the logged in user is following this user

  // const viewDates = () => console.log('view dates');

  const newDate = () => flipNewDateModal();

  const showFilter = () => flipFilterModal();

  return (
    <HeaderCard style={styles.overRide}>
      <View style={styles.header}>
        <TouchableOpacity onPress={newDate} style={{ flex: 1 }} accessible={false}>
          <View style={[styles.headerItem]}>
            <MyAppText style={styles.textStyle}>New Date</MyAppText>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={showFilter} style={{ flex: 1 }} accessible={false}>
          <View style={[styles.headerItem, { borderLeftWidth: 1, borderLeftColor: 'black' }]}>
            <MyAppText style={styles.textStyle}>Filter</MyAppText>
          </View>
        </TouchableOpacity>
      </View>
    </HeaderCard>
  );
};

// We put the styles in the component
const styles = StyleSheet.create<Style>({
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    // backgroundColor: 'black',
  },
  textStyle: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  overRide: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#000',
  },
  headerItem: {
    justifyContent: 'space-around',
    flex: 1,
  },
});

export default StaggHeader;
