import React, { Component } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { Mutation } from 'react-apollo';
import { LoginManager } from 'react-native-fbsdk';
import { auth } from '../firebase';
import { SET_ID_LOCAL } from '../../apollo/local/mutations';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ICON_SIZE, ICON_OPACITY } from '../variables';
import { MyAppText, Spinner } from './common';

export default class LogoutButton extends Component {
  constructor(props) {
    this.state = {
      loading,
    };
  }

  startLogout = (setId) => {
    this.setState({ loading: true });
    auth.signOut();
    LoginManager.logOut();
    setId(0);
    this.setState({ loading: false });
  }

  renderLogoutButton = (setId) => {
    const { optionsText, buttons } = styles;
    if(this.state.loading) {
      return <Spinner />;
    }

    return (
      <TouchableOpacity
        onPress={() => this.startLogout(setId)}
        style={buttons}
      >
        <MaterialCommunityIcons
          name="logout"
          size={ICON_SIZE}
          color="black"
          style={{ opacity: ICON_OPACITY }}
        />
        <MyAppText style={optionText}>
          {'Log Out'}
        </MyAppText>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <Mutation mutation={SET_ID_LOCAL}>
        {(setId) => (
          <View>
            {renderLogoutButton(setId)}
          </View>
        )}
      </Mutation>
    )
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
})
