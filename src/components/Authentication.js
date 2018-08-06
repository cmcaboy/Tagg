import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import {Header, Button, Spinner, CardSection} from './common';
import {Root} from 'native-base';
import LoginForm from './LoginForm';
import Settings from './Settings';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import MainNavigator from '../navigator';
import { firebase } from '../firebase';
import { standard_font } from '../styles';
import { STATUS_BAR_COLOR } from '../variables';

function UdaciStatusBar ({backgroundColor, ...props}) {
  return (
    <View style={{ backgroundColor, height: getStatusBarHeight() }}>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
  )
}

class Authentication extends React.Component {

  state = { 
    loggedIn: true
  }
  
  // componentWillMount() {
  //   // Firebase authentication details gathered from my firebase account.
  //   firebase.auth().onAuthStateChanged((user) => {
  //     // console.log('user: ',user);
  //     // console.log('firebase auth: ',firebase.auth());
  //     // console.log('firebase uid: ',firebase.auth().currentUser);
  //     if(user) {
  //       //this.props.login(user.uid);

  //       this.setState({loggedIn: true});

  //       // We can use the firebase.auth().currentUSer.uid for our unique identifier.
  //     } else {
  //       this.setState({loggedIn: false});
        
  //       //this.setState({loggedIn: false});
  //     }
  //   })
  // }

  renderContent() {
    // use a switch statement to render a login screen, logout screen, or a spinner
    console.log('loggedIn: ',this.state.loggedIn);
    switch(this.state.loggedIn) {
      case true:
          console.log('logged in');
          return (
            <Root>
              <MainNavigator />
            </Root>
          )
          // <LoginForm />
          //return <Settings />
            //<CardSection><Button onPress={() => firebase.auth().signOut()}>Log Out</Button></CardSection>
      case false:
        return <LoginForm />
      default:
        return <View style={styles.spinnerStyle}><Spinner size="large"/></View>
    }
  }
  render() {
    return (
      <View style={styles.container}>
        {/*<UdaciStatusBar backgroundColor={STATUS_BAR_COLOR} barStyle="light-content" />*/}
        {this.renderContent()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  spinnerStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default Authentication;
