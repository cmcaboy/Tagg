import React, { Component } from 'react';
// import firebase from 'firebase';
import { View } from 'react-native';
import { ApolloConsumer, Mutation } from 'react-apollo';
import { CardSection, MyAppText } from './common';
import { PRIMARY_COLOR, BACKGROUND_COLOR } from '../variables';
import { getCurrentTime } from '../format';
import FBLoginButton from '../services/FBLoginButton';
import { NEW_USER } from '../apollo/mutations';
import { SET_ID_LOCAL } from '../apollo/local/mutations';

class LoginForm extends Component {
    constructor(props) {
      super(props);

      this.state = {
        email: '',
        password: '',
        error: '',
        isLoading: false,
      };
    }

    render() {
      const { error } = this.props;
        return (
            <View style={styles.loginContainer}>
              <View style={styles.content}>
                <MyAppText style={styles.title}>
                  {'Manhattan Stag'}
                </MyAppText>
                <MyAppText style={styles.errorTextStyle}>
                  {error}
                </MyAppText>
                <CardSection style={{borderBottomWidth: 0 }}>
                  <Mutation mutation={NEW_USER}>
                    {(newUser) => {
                      const startNewUser = user => newUser({
                        variables: {
                          id: user.id,
                          name: user.name,
                          active: user.active,
                          email: user.email,
                          gender: user.gender,
                          description: user.description,
                          school: user.school,
                          work: user.work,
                          sendNotifications: user.sendNotifications,
                          distance: user.distance,
                          token: user.token,
                          latitude: user.latitude ? user.latitude : 40.000,
                          longitude: user.longitude ? user.longitude : -75.000,
                          minAgePreference: user.minAgePreference,
                          maxAgePreference: user.maxAgePreference,
                          pics: user.pics,
                          registerDateTime: getCurrentTime(),
                        },
                      });
                        return (
                          <Mutation mutation={SET_ID_LOCAL}>
                            {(setId) => {
                              const startSetId = id => setId({ variables: { id } });
                              return (
                                <ApolloConsumer>
                                  {client => <FBLoginButton client={client} startNewUser={startNewUser} startSetId={startSetId}/>}
                                </ApolloConsumer>
                              );
                            }}
                          </Mutation>
                        );
                    }}
                  </Mutation>
                </CardSection>
              </View>
              <View style={{ flex: 1 }} />
            </View>
        );
    }
}

const styles = {
  errorTextStyle: {
    fontSize: 20,
    alignSelf: 'center',
    color: 'red',
  },
  buttonFBStyle: {
    backgroundColor: '#4C69BA',
  },
  buttonTextFBStyle: {
    color: '#FFF',
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: BACKGROUND_COLOR,
  },
  title: {
    fontSize: 32,
    color: PRIMARY_COLOR,
  },
  content: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default LoginForm;
