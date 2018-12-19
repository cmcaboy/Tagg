import React, { Component } from 'react';
import {
  View, StyleSheet, ScrollView, ViewStyle, TextStyle,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import getUserProfile from '../selectors/getUserProfile';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Query } from 'react-apollo';
import { NavigationRoute, NavigationScreenProp } from 'react-navigation';
import UserProfilePhotos from './UserProfilePhotos';
import DateOpenButton from './DateOpenButton';
import {
  MyAppText, Spinner, FollowButton, ErrorMessage,
} from './common';
import { PRIMARY_COLOR } from '../variables';
import { formatDistanceApart, formatName } from '../format';
import { GET_USER_PROFILE } from '../apollo/queries';
import {
  getUserProfile,
  getUserProfileVariables,
} from '../apollo/queries/__generated__/getUserProfile';
import FlagMenu from './common/FlagMenu';

interface Params {
  name: string;
  id: string;
  hostId: string;
}

interface Props {
  navigation: NavigationScreenProp<NavigationRoute<Params>, Params>;
}

interface State {}

class GetUserProfile extends Query<getUserProfile, getUserProfileVariables> {}

class UserProfile extends Component<Props, State> {
  static navigationOptions = ({
    navigation,
    navigation: {
      state: {
        params: { id, hostId, name },
      },
    },
  }: {
  navigation: NavigationScreenProp<NavigationRoute<Params>, Params>;
  }) => ({
    // title: `${navigation.state.params.name}`,
    // headerRight: <View />,
    headerRight: <FlagMenu name={name} id={id} hostId={hostId} size={22} />,
    headerTitle: (
      <View style={styles.headerViewStyle}>
        <MyAppText style={styles.textHeader}>{`${navigation.state.params.name}`}</MyAppText>
        <View style={{ width: 30 }} />
      </View>
    ),
    headerTitleStyle: {
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
      userProfileContainer,
      userInfo,
      iconText,
      nameText,
      subHeading,
      schoolText,
      userDescription,
      userInfoLeft,
      userInfoRight,
    } = styles;

    const {
      navigation,
      navigation: {
        state: {
          params: { id, hostId },
        },
      },
    } = this.props;

    return (
      <GetUserProfile query={GET_USER_PROFILE} variables={{ id, hostId }}>
        {({
          loading, error, data, refetch,
        }) => {
          // console.log('loading: ',loading);
          // console.log('error: ',error);
          // console.log('data: ',data);
          if (loading) return <Spinner />;
          if (error) return <ErrorMessage error={error.message} refetch={refetch} />;
          const {
            name,
            school,
            work,
            description,
            pics,
            isFollowing,
            distanceApart,
            hasDateOpen,
          } = data.user;
          const profilePic = pics[0];
          return (
            <View style={userProfileContainer}>
              <UserProfilePhotos pics={pics} cacheImages />
              <ScrollView>
                <View style={userInfo}>
                  <View style={userInfoLeft}>
                    <MyAppText style={nameText}>{formatName(name)}</MyAppText>
                    {!!school && (
                      <View style={subHeading}>
                        <Ionicons name="md-school" size={14} color="black" style={iconText} />
                        <MyAppText style={schoolText}>{school}</MyAppText>
                      </View>
                    )}
                    {!!work && (
                      <View style={subHeading}>
                        <MaterialIcons name="work" size={14} color="black" style={iconText} />
                        <MyAppText style={[schoolText, { paddingLeft: 4 }]}>{work}</MyAppText>
                      </View>
                    )}
                  </View>
                  <View style={userInfoRight}>
                    <MyAppText style={styles.distance}>
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
                  {!!description && <MyAppText>{description}</MyAppText>}
                </View>
              </ScrollView>
            </View>
          );
        }}
      </GetUserProfile>
    );
  }
}

interface Style {
  userProfileContainer: ViewStyle;
  headerViewStyle: ViewStyle;
  textHeader: TextStyle;
  userInfo: ViewStyle;
  userInfoRight: ViewStyle;
  userInfoLeft: ViewStyle;
  schoolText: TextStyle;
  iconText: TextStyle;
  distance: TextStyle;
  nameText: TextStyle;
  userDescription: TextStyle;
  subHeading: ViewStyle;
  horizontalLine: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  userProfileContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#FFF',
  },
  headerViewStyle: {
    flexDirection: 'row',
    // flex: 1,
    // justifyContent: 'flex-end',
    paddingVertical: 5,
  },
  textHeader: {
    alignSelf: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    color: '#000',
    paddingLeft: 8,
  },
  userInfo: {
    paddingHorizontal: 10,
    marginTop: 10,
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  userInfoRight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    marginTop: 20,
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
  distance: {
    opacity: 0.6,
    fontSize: 11,
    fontStyle: 'italic',
  },
  nameText: {
    fontSize: 28,
    // color: PRIMARY_COLOR,
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
    // paddingVertical: 10,
    marginBottom: 10,
    marginTop: 0,
    opacity: 0.3,
  },
});

export default UserProfile;
