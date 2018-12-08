import React, { Component } from 'react';
import {
  StyleSheet, View, TouchableOpacity, ViewStyle, TextStyle,
} from 'react-native';
import { Mutation } from 'react-apollo';
import { LoginManager } from 'react-native-fbsdk';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { auth } from '../firebase';
import { SET_ID_LOCAL } from '../apollo/local/mutations';
import { ICON_SIZE, ICON_OPACITY } from '../variables';
import { MyAppText, Spinner } from './common';
import { setId, setIdVariables } from '../apollo/local/mutations/__generated__/setId';

interface Props {}

interface State {
  loading: boolean;
}

class SetID extends Mutation<setId, setIdVariables> {}

export default class LogoutButton extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  startLogout = (setId: (obj: any) => void) => {
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

  renderLogoutButton = (setId: (obj: any) => void) => {
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
      <SetID mutation={SET_ID_LOCAL}>
        {setId => <View>{this.renderLogoutButton(setId)}</View>}
      </SetID>
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
