import React, { SFC } from 'react';
import {
  View, Image, TouchableOpacity, StyleSheet, ViewStyle, TextStyle,
} from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ActionSheet } from 'native-base';
import { Mutation } from 'react-apollo';
import DateOpenButton from './DateOpenButton';
// import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  formatDistanceApart, formatName, formatSchool, formatWork,
} from '../format';
import { WideCard, MyAppText, FollowButton } from './common';
import { PICTURE_WIDTH } from '../variables';
import { BLOCK_USER, FLAG_AND_BLOCK_USER } from '../apollo/mutations';
import { blockVariables, block } from '../apollo/mutations/__generated__/block';
import { flag, flagVariables } from '../apollo/mutations/__generated__/flag';

interface Props {
  hostId: string;
  navigation: NavigationScreenProp<any, any>;
  user: any;
}

interface Style {
  bodyStyle: ViewStyle;
  rightCard: ViewStyle;
  description: ViewStyle;
  userInfo: ViewStyle;
  subHeading: ViewStyle;
  nameText: TextStyle;
  ageText: TextStyle;
  distance: TextStyle;
  iconText: TextStyle;
  schoolText: TextStyle;
  topView: ViewStyle;
}

class BlockUser extends Mutation<block, blockVariables> {}
class FlagUser extends Mutation<flag, flagVariables> {}

const StaggCard: SFC<Props> = ({
  hostId,
  navigation,
  user: {
    profilePic, school, work, name, distanceApart, age, isFollowing, hasDateOpen, id,
  },
}) => {
  // Takes the following props
  // -------------------------
  // user = object containing user information: name, age, distanceApart, school, work, profilePic
  // navigation = react navigation object

  console.log('isFollowing: ', isFollowing);

  const onPress = () => navigation.navigate('UserProfile', { id, name, hostId });

  const BUTTONS = ['Report', 'Block', 'Cancel'];
  const REPORT_INDEX = 0;
  const BLOCK_INDEX = 1;
  const REPORT_AND_BLOCK_INDEX = 2;
  const CANCEL_INDEX = 3;

  const openMenu = ({
    blockUser,
    flagUser,
  }: {
  blockUser: (options: any) => void;
  flagUser: (options: any) => void;
  }) => {
    ActionSheet.show(
      { options: BUTTONS, cancelButtonIndex: CANCEL_INDEX, title: 'Options' },
      (selectedIndex) => {
        switch (selectedIndex) {
          case REPORT_INDEX:
            blockUser({ variables: { id: hostId, blockedId: id } });
            return;
          case BLOCK_INDEX:
            // Should also remove from cache
            flagUser({ variables: { id: hostId, flaggedId: id } });
            return;
          case REPORT_AND_BLOCK_INDEX:
            // Should also remove from cache
            flagUser({ variables: { id: hostId, flaggedId: id, block: true } });
        }
      },
    );
  };

  return (
    <WideCard footer={!!hasDateOpen}>
      <View style={styles.bodyStyle}>
        <TouchableOpacity accessible={false} onPress={onPress}>
          <Image
            source={{ uri: profilePic }}
            style={{ height: PICTURE_WIDTH, width: PICTURE_WIDTH, borderRadius: 5 }}
          />
        </TouchableOpacity>
        <View style={styles.userInfo}>
          <View style={{ justifyContent: 'space-between' }}>
            <View style={styles.description}>
              <View style={styles.topView}>
                <TouchableOpacity onPress={onPress} accessible={false}>
                  <View style={{ flexDirection: 'row' }}>
                    <MyAppText style={styles.nameText}>{formatName(name)}</MyAppText>
                    <MyAppText style={styles.ageText}>{age ? `, ${age}` : null}</MyAppText>
                  </View>
                </TouchableOpacity>
                {/*I could place this in its own component so I can reuse*/}
                <BlockUser mutation={BLOCK_USER}>
                  {blockUser => (
                    <FlagUser mutation={FLAG_AND_BLOCK_USER}>
                      {flagUser => (
                        <TouchableOpacity onPress={() => openMenu({ blockUser, flagUser })}>
                          <MaterialCommunityIcons name="dots-vertical" size={14} />
                        </TouchableOpacity>
                      )}
                    </FlagUser>
                  )}
                </BlockUser>
              </View>
              {!!school && (
                <View style={styles.subHeading}>
                  {/* <Ionicons name="md-school" size={14} color="black" style={styles.iconText}/> */}
                  <MyAppText style={styles.schoolText}>{formatSchool(school)}</MyAppText>
                </View>
              )}
              {!!work && (
                <View style={styles.subHeading}>
                  {/* <MaterialIcons name="work" size={14} color="black" style={styles.iconText}/> */}
                  <MyAppText style={[styles.schoolText]}>{formatWork(work)}</MyAppText>
                </View>
              )}
            </View>
            <View />
          </View>
          <View style={styles.rightCard}>
            <MyAppText style={styles.distance}>{formatDistanceApart(distanceApart)}</MyAppText>
            <FollowButton isFollowing={isFollowing} id={hostId} followId={id} />
          </View>
        </View>
      </View>
      <DateOpenButton
        hostId={hostId}
        hasDateOpen={!!hasDateOpen}
        id={id}
        name={name}
        profilePic={profilePic}
        navigation={navigation}
      />
    </WideCard>
  );
};

// We put the styles in the component
const styles = StyleSheet.create<Style>({
  bodyStyle: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 10,
  },
  topView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rightCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  description: {
    justifyContent: 'flex-start',
  },
  userInfo: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    // alignItems: 'center',
    marginLeft: 8,
  },
  subHeading: {
    flexDirection: 'row',
  },
  nameText: {
    fontSize: 18,
    color: '#000',
    fontWeight: '400',
  },
  ageText: {
    fontSize: 18,
    // color: '#000',
    fontWeight: '100',
    opacity: 0.85,
  },
  distance: {
    opacity: 0.6,
    fontSize: 11,
    fontStyle: 'italic',
  },
  iconText: {
    fontSize: 14,
    opacity: 0.7,
  },
  schoolText: {
    fontSize: 11,
    opacity: 0.7,
  },
});

export default StaggCard;
