import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import DateOpenButton from './DateOpenButton';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { formatDistanceApart } from '../format';
import { WideCard, MyAppText, FollowButton } from './common';

const StaggCard = (
  {
    hostId, navigation, user: {
      profilePic, school, work, name, distanceApart, age, isFollowing, hasDateOpen, id,
    },
  },
) => {
  // Takes the following props
  // -------------------------
  // user = object containing user information: name, age, distanceApart, school, work, profilePic
  // navigation = react navigation object
  // isFollowing = boolean that indicates whether the logged in user is following this user

  console.log('isFollowing: ', isFollowing);

  const onPress = () => navigation.navigate('UserProfile', { id, name, hostId });

  return (
    <WideCard footer={!!hasDateOpen}>
      <View style={styles.bodyStyle}>
        <TouchableOpacity onPress={onPress}>
          <Image
            source={{ uri: profilePic }}
            style={{ height: 115, width: 115, borderRadius: 5 }}
          />
        </TouchableOpacity>
        <View style={styles.userInfo}>
          <View style={{ justifyContent: 'space-between' }}>
            <View style={styles.description}>
              <TouchableOpacity onPress={onPress}>
                <View style={{ flexDirection: 'row' }}>
                  <MyAppText style={styles.nameText}>
                    {name}
                  </MyAppText>
                  <MyAppText style={styles.ageText}>
                    {age ? `, ${age}` : null}
                  </MyAppText>
                </View>
              </TouchableOpacity>
              {!!school && (
                <View style={styles.subHeading}>
                  {/* <Ionicons name="md-school" size={14} color="black" style={styles.iconText}/> */}
                  <MyAppText style={styles.schoolText}>
                    {school}
                  </MyAppText>
                </View>
              )}
              {!!work && (
                <View style={styles.subHeading}>
                  {/* <MaterialIcons name="work" size={14} color="black" style={styles.iconText}/> */}
                  <MyAppText style={[styles.schoolText]}>
                    {work}
                  </MyAppText>
                </View>
              )}
            </View>
            <View />
          </View>
          <View style={styles.rightCard}>
            <MyAppText style={styles.distance}>
                {formatDistanceApart(distanceApart)}
            </MyAppText>
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
const styles = StyleSheet.create({
    bodyStyle: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 10,
  },
  rightCard: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-end', 
  },
  description: {
    justifyContent: 'flex-start',
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
    marginLeft: 8,
  },
  subHeading: {
    flexDirection: 'row',
  },
  nameText: {
    fontSize: 22,
    color: '#000',
    fontWeight: '400',
  },
  ageText: {
    fontSize: 22,
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
