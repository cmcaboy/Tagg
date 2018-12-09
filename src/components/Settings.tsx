import React from 'react';
import {
  View, TouchableOpacity, StyleSheet, ViewStyle, TextStyle,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Query } from 'react-apollo';
import { NavigationScreenProp, NavigationRoute } from 'react-navigation';
import {
  CirclePicture, MyAppText, Spinner, ErrorMessage,
} from './common';
import {
  PRIMARY_COLOR,
  PLACEHOLDER_PHOTO,
  PROFILE_NOT_FOUND,
  ICON_OPACITY,
  ICON_SIZE,
} from '../variables';
import { GET_PROFILE } from '../apollo/queries';
// import { GET_ID } from '../apollo/local/queries';
import LogoutButton from './LogoutButton';
// import { getId } from '../apollo/queries/__generated__/getId';
import { getProfile, getProfileVariables } from '../apollo/queries/__generated__/getProfile';

interface Props {
  navigation: NavigationScreenProp<NavigationRoute<{}>, {}>;
}

interface State {}

// class GetID extends Query<getId, {}> {};

class GetProfile extends Query<getProfile, getProfileVariables> {}

class Settings extends React.Component<Props, State> {
  renderSubheading = (work: string, school: string): JSX.Element => {
    if (work || school) {
      if (school) {
        return (
          <View style={styles.subHeading}>
            <Ionicons name="md-school" size={14} color="black" style={styles.schoolText} />
            <MyAppText style={[styles.schoolText, { paddingLeft: 4 }]}>{school}</MyAppText>
          </View>
        );
      }
      return (
        <View style={styles.subHeading}>
          <MaterialIcons name="work" size={14} color="black" style={styles.schoolText} />
          <MyAppText style={[styles.schoolText, { paddingLeft: 4 }]}>{work}</MyAppText>
        </View>
      );
    }
    return null;
  };

  renderContent({
    work,
    school,
    name,
    pics,
  }: {
  work: string;
  school: string;
  name: string;
  pics: string[];
  }) {
    const {
      navigation: { navigate },
    } = this.props;
    const profilePic = pics[0] || PLACEHOLDER_PHOTO;
    return (
      <View style={styles.settingsContainer}>
        <View style={styles.miniProfile}>
          <CirclePicture picSize="large" imageURL={profilePic} auto />
          <View style={styles.profileText}>
            <MyAppText style={styles.nameText}>{name}</MyAppText>
            {this.renderSubheading(work, school)}
          </View>
          <View style={styles.horizontalLine} />
        </View>
        <View style={styles.options}>
          <TouchableOpacity
            onPress={() => navigate('EditSettingsContainer')}
            style={styles.buttons}
          >
            <Ionicons
              name="md-settings"
              size={ICON_SIZE}
              color="black"
              style={{ opacity: ICON_OPACITY }}
            />
            <MyAppText style={styles.optionText}>Settings</MyAppText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigate('EditProfile')} style={styles.buttons}>
            <MaterialCommunityIcons
              name="account-edit"
              size={ICON_SIZE}
              color="black"
              style={{ opacity: ICON_OPACITY }}
            />
            <MyAppText style={styles.optionText}>Edit Info</MyAppText>
          </TouchableOpacity>
        </View>
        <LogoutButton />
      </View>
    );
  }

  render() {
    // return (
    // <GetID query={GET_ID}>
    //   {({ loading: loadingLocal, error: errorLocal, data: dataLocal }) => {
    //     // console.log('local data: ',data);
    //     // console.log('local error: ',error);
    //     // console.log('local loading: ',loading);
    //     if (loadingLocal) return <Spinner />;
    //     if (errorLocal) return <ErrorMessage error={errorLocal.message} />;

    // const { id } = dataLocal.user;
    return (
      <GetProfile query={GET_PROFILE}>
        {({
          loading, error, data, refetch,
        }) => {
          console.log('loading: ', loading);
          // console.log('error: ',error);
          console.log('data: ', data);
          if (loading) return <Spinner />;
          if (error) return <ErrorMessage error={error.message} refetch={refetch} />;
          if (!data.user) return <ErrorMessage error={PROFILE_NOT_FOUND} refetch={refetch} />;
          return this.renderContent(data.user);
        }}
      </GetProfile>
    );
    //     }}
    //   </GetID>
    // );
  }
}

interface Style {
  settingsContainer: ViewStyle;
  miniProfile: ViewStyle;
  profileText: TextStyle;
  options: ViewStyle;
  optionText: TextStyle;
  nameText: TextStyle;
  schoolText: TextStyle;
  buttons: ViewStyle;
  subHeading: ViewStyle;
  horizontalLine: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  buttons: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  horizontalLine: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    flex: 1,
    marginBottom: 10,
    paddingVertical: 10,
  },
  miniProfile: {
    alignItems: 'center',
    flex: 2,
    justifyContent: 'flex-start',
    marginTop: 20,
    minHeight: 100,
  },
  nameText: {
    color: PRIMARY_COLOR,
    fontSize: 30,
    textAlign: 'center',
    // fontFamily:'oxygen-regular'
  },
  optionText: {
    opacity: 0.7,
  },
  options: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  profileText: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  schoolText: {
    fontSize: 14,
    opacity: 0.7,
  },
  settingsContainer: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0,
    borderColor: '#ddd',
    borderRadius: 10,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'space-between',
    margin: 10,
    paddingBottom: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  subHeading: {
    flexDirection: 'row',
    marginTop: 2,
  },
});

export default Settings;
