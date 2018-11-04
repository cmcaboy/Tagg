import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Mutation } from 'react-apollo';
import { LoginManager } from 'react-native-fbsdk';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { auth } from '../firebase';
import { SET_ID_LOCAL } from '../apollo/local/mutations';
import { ICON_SIZE, ICON_OPACITY } from '../variables';
import { MyAppText, Spinner } from './common';

export default class LogoutButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  startLogout = (setId) => {
    // Render Spinner
    this.setState({ loading: true });
    // sign out of Firebase auth
    auth.signOut();
    // sign out of FBSDK
    LoginManager.logOut();
    // set the id in our local catch to 0, which indicates to user is logged in.
    setId({ variables: { id: 0 } });
    // Turn the spinner off.
    this.setState({ loading: false });
  };

  renderLogoutButton = (setId) => {
    const { optionsText, buttons } = styles;
    const { loading } = this.state;
    if (loading) {
      return <Spinner />;
    }

    return (
      <TouchableOpacity onPress={() => this.startLogout(setId)} style={buttons}>
        <MaterialCommunityIcons
          name="logout"
          size={ICON_SIZE}
          color="black"
          style={{ opacity: ICON_OPACITY }}
        />
        <MyAppText style={optionsText}>Log Out</MyAppText>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <Mutation mutation={SET_ID_LOCAL}>
        {setId => <View>{this.renderLogoutButton(setId)}</View>}
      </Mutation>
    );
  }
}

const styles = StyleSheet.create({
  buttons: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsText: {
    opacity: ICON_OPACITY,
  },
});
