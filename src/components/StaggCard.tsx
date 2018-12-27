import React, { SFC } from 'react';
import {
  View, Image, TouchableOpacity, StyleSheet, ViewStyle, TextStyle,
} from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import DateOpenButton from './DateOpenButton';
import {
  formatDistanceApart, formatName, formatSchool, formatWork,
} from '../format';
import { WideCard, MyAppText, FollowButton } from './common';
import { PICTURE_WIDTH } from '../variables';
import FlagMenu from './common/FlagMenu';

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

  // console.log('isFollowing: ', isFollowing);

  const onPress = () => navigation.navigate('UserProfile', { id, name, hostId });

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
                {/* I could place this in its own component so I can reuse */}
                <FlagMenu name={name} id={id} hostId={hostId} navigation={navigation} />
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
