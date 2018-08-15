import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import getUserProfile from '../selectors/getUserProfile';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Query } from 'react-apollo';
import UserProfilePhotos from './UserProfilePhotos';
import DateOpenButton from './DateOpenButton';
import { MyAppText, Spinner, FollowButton, ErrorMessage } from './common';
import { PRIMARY_COLOR } from '../variables';
import { formatDistanceApart } from '../format';
import { GET_USER_PROFILE } from '../apollo/queries';

class UserProfile extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.name}`,
    headerRight: (<View />),
    headerTitleStyle:
      {
        alignSelf: 'center',
        textAlign: 'center',
        fontWeight: 'normal',
        fontSize: 22,
        color: PRIMARY_COLOR,
      },
  });

  // constructor(props) {
  //   super(props);
  // }

  render() {
    const {
      userProfileContainer, userInfo, iconText,
      nameText, subHeading, schoolText, userDescription,
      userInfoLeft, userInfoRight,
    } = styles;

    const { navigation, navigation: { state: { params: { id, hostId } } } } = this.props;

    return (
      <Query query={GET_USER_PROFILE} variables={{ id, hostId }}>
      {({ loading, error, data }) => {
        // console.log('loading: ',loading);
        // console.log('error: ',error);
        // console.log('data: ',data);
        if (loading) return <Spinner />;
        if (error) return <ErrorMessage error={error.message} />;
        const {
          name, school, work, description, pics, isFollowing, distanceApart, hasDateOpen,
        } = data.user;
        const profilePic = pics[0];
        return (
          <View style={userProfileContainer}>
            <UserProfilePhotos
              pics={pics}
              cacheImages
            />
            <ScrollView>
              <View style={userInfo}>
                <View style={userInfoLeft}>
                  <MyAppText style={nameText}>
                    {name}
                  </MyAppText>
                  {!!school && (
                    <View style={subHeading}>
                      <Ionicons name="md-school" size={14} color="black" style={iconText} />
                      <MyAppText style={schoolText}>
                        {school}
                      </MyAppText>
                    </View>
                  )}
                  {!!work && (
                    <View style={subHeading}>
                      <MaterialIcons name="work" size={14} color="black" style={iconText} />
                      <MyAppText style={[schoolText, { paddingLeft: 4 }]}>
                        {work}
                      </MyAppText>
                    </View>
                  )}
                </View>
                  <View style={userInfoRight}>
                    <MyAppText>
                      {formatDistanceApart(distanceApart)}
                    </MyAppText>
                    <FollowButton id={hostId} followId={id} isFollowing={isFollowing} />
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
              <View style={styles.horizontalLine} />
              <View style={userDescription}>
                {!!description && (
                  <MyAppText>
                    {description}
                  </MyAppText>
                )}
              </View>
            </ScrollView>
          </View>
        );
      }}
      </Query>
    );
  }
}

const styles = StyleSheet.create({
  userProfileContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#FFF',
  },
  userInfo: {
    paddingHorizontal: 10,
    marginTop: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  userInfoRight: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  userInfoLeft: {
    flexDirection: 'column',
  },
  schoolText: {
    fontSize: 14,
    opacity: 0.7,
    paddingLeft: 5,
  },
  iconText: {
    fontSize: 14,
    opacity: 0.7,
  },

  nameText: {
    fontSize: 28,
    color: PRIMARY_COLOR,
  },
  userDescription: {
    flex: 1,
    paddingLeft: 10,
  },
  subHeading: {
    flexDirection: 'row',
  },
  horizontalLine: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    paddingVertical: 10,
    marginBottom: 10,
    opacity: 0.3,
  },
});

export default UserProfile;
