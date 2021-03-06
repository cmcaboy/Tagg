import React from 'react';
import {
  StyleSheet, View, StatusBar, ViewStyle, StatusBarProps, AsyncStorage,
} from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
// import { Root } from 'native-base';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
// import { Spinner } from './common';
import LoginForm from './LoginForm';
// import { firebase } from '../firebase';
import { STATUS_BAR_COLOR } from '../variables';
import GANavigationWrapper from '../navigator';
import { isUserLoggedIn } from '../apollo/queries/__generated__/isLoggedIn';

interface State {
  loggedIn: boolean;
}

interface Props {}

class IsUserLoggedIn extends Query<isUserLoggedIn, {}> {}

interface Style {
  container: ViewStyle;
  spinnerStyle: ViewStyle;
}

interface UdaciStatusBarProps extends StatusBarProps {
  backgroundColor: string;
}

function UdaciStatusBar({ backgroundColor, ...props }: UdaciStatusBarProps) {
  return (
    <View style={{ backgroundColor, height: getStatusBarHeight() }}>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
  );
}

const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

class Authentication extends React.Component<Props, State> {
  // state = {
  //   loggedIn: false,
  // };

  componentWillMount = async () => {
    // Firebase authentication details gathered from my firebase account.
    // firebase.auth().onAuthStateChanged((user: string) => {
    //   // console.log('Authentication user: ', user);
    //   // console.log('firebase auth: ',firebase.auth());
    //   // console.log('firebase uid: ',firebase.auth().currentUser);
    //   if (user) {
    //     // this.props.login(user.uid);
    //     this.setState({ loggedIn: true });
    //     // We can use the firebase.auth().currentUSer.uid for our unique identifier.
    //   } else {
    //     this.setState({ loggedIn: false });
    //     // this.setState({loggedIn: false});
    //   }
    // });
  };

  // renderContent() {
  //   // use a switch statement to render a login screen, logout screen, or a spinner
  //   const { loggedIn } = this.state;

  //   console.log('loggedIn: ', loggedIn);

  //   switch (loggedIn) {
  //     case true:
  //       return <GANavigationWrapper />;
  //     // <LoginForm />
  //     // return <Settings />
  //     // <CardSection><Button onPress={() => firebase.auth().signOut()}>Log Out</Button></CardSection>
  //     case false:
  //       return <LoginForm />;
  //     default:
  //       return (
  //         <View style={styles.spinnerStyle}>
  //           <Spinner size="large" />
  //         </View>
  //       );
  //   }
  // }

  render() {
    return (
      <View style={styles.container}>
        <UdaciStatusBar backgroundColor={STATUS_BAR_COLOR} barStyle="light-content" />
        <IsUserLoggedIn query={IS_LOGGED_IN}>
          {({ data }) => (data.isLoggedIn ? <GANavigationWrapper /> : <LoginForm />)}
        </IsUserLoggedIn>
        {/* {this.renderContent()} */}
      </View>
    );
  }
}

const styles = StyleSheet.create<Style>({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  spinnerStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Authentication;
