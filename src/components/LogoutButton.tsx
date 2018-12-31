import React, { Component } from 'react';
import {
  StyleSheet, TouchableOpacity, ViewStyle, TextStyle, AsyncStorage,
} from 'react-native';
import { LoginManager } from 'react-native-fbsdk';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ApolloConsumer } from 'react-apollo';
import { auth, analytics } from '../firebase';
import { ICON_SIZE, ICON_OPACITY } from '../variables';
import { MyAppText, Spinner } from './common';

interface Props {}

interface State {
  loading: boolean;
}

export default class LogoutButton extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  startLogout = async (client: any) => {
    analytics.logEvent('Click_logoutButton');
    // Render Spinner
    this.setState({ loading: true });
    // sign out of Firebase auth
    auth.signOut();
    // sign out of FBSDK
    LoginManager.logOut();
    // set the id in our local catch to 0, which indicates to user is logged in.
    await AsyncStorage.removeItem('TaggToken');
    await client.writeData({ data: { isLoggedIn: false } });
    // Turn the spinner off.
    this.setState({ loading: false });
  };

  render() {
    const { optionsText, buttons } = styles;
    const { loading } = this.state;
    if (loading) {
      return <Spinner />;
    }
    return (
      <ApolloConsumer>
        {client => (
          <TouchableOpacity onPress={() => this.startLogout(client)} style={buttons}>
            <MaterialCommunityIcons
              name="logout"
              size={ICON_SIZE}
              color="black"
              style={{ opacity: ICON_OPACITY }}
            />
            <MyAppText style={optionsText}>Log Out</MyAppText>
          </TouchableOpacity>
        )}
      </ApolloConsumer>
    );
  }
}

interface Style {
  buttons: ViewStyle;
  optionsText: TextStyle;
}

const styles = StyleSheet.create<Style>({
  buttons: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsText: {
    opacity: ICON_OPACITY,
  },
});
