import React, { Component } from 'react';
// import firebase from 'firebase';
import {
  View,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { ApolloConsumer, Mutation } from 'react-apollo';
import { Form, Item, Input, Button, Text } from 'native-base';
import { CardSection, MyAppText } from './common';
import { PRIMARY_COLOR, BACKGROUND_COLOR, DEFAULT_LATITUDE, DEFAULT_LONGITUDE } from '../variables';
import { getCurrentTime } from '../format';
import FBLoginButton from '../services/FBLoginButton';
import { NEW_USER } from '../apollo/mutations';
import { SET_ID_LOCAL } from '../apollo/local/mutations';
import emailLogin from '../services/emailLogin';

class LoginForm extends Component {
  constructor(props) {
    super(props);

    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.linear();

    this.state = {
      email: '',
      password: '',
      error: '',
      emailError: '',
      isLoading: false,
      showEmail: false,
    };
  }

  toggleEmail = () => this.setState(prev => ({ showEmail: !prev.showEmail }))

  emailInput = email => this.setState({ email: email.toLowerCase() })

  passwordInput = password => this.setState({ password });

  setError = e => this.setState({ emailError: e })

  componentWillUpdate = () => {
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.linear();
  }

  render() {
    const { error, emailError } = this.state;
    return (
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
              latitude: user.latitude || DEFAULT_LATITUDE,
              longitude: user.longitude || DEFAULT_LONGITUDE,
              minAgePreference: user.minAgePreference,
              maxAgePreference: user.maxAgePreference,
              pics: user.pics,
              registerDateTime: getCurrentTime(),
              followerDisplay: 'Both', // default
            },
          });
          return (
            <Mutation mutation={SET_ID_LOCAL}>
              {(setId) => {
                const startSetId = id => setId({ variables: { id } });
                return (
                  <ScrollView>
                    <KeyboardAvoidingView
                      style={styles.loginContainer}
                      behavior="padding"
                      enabled
                    >
                      <View style={styles.content}>
                        <MyAppText style={styles.title}>
                          { 'Tagg' }
                        </MyAppText>
                        <MyAppText style={styles.subTitle}>
                          { 'Find a date...... Fast!' }
                        </MyAppText>
                        <MyAppText style={styles.errorTextStyle}>
                          {error}
                        </MyAppText>
                        <CardSection style={{ borderBottomWidth: 0 }}>
                          <ApolloConsumer>
                            {client => <FBLoginButton client={client} startNewUser={startNewUser} startSetId={startSetId} />}
                          </ApolloConsumer>
                        </CardSection>
                      </View>
                      <View style={styles.emailContainer}>
                        <TouchableOpacity onPress={this.toggleEmail}>
                          <Text style={styles.emailFormTitleText}>
                            { 'Login with Email' }
                          </Text>
                        </TouchableOpacity>
                        {this.state.showEmail && (
                          <View style={styles.emailForm}>
                            <MyAppText style={styles.errorTextStyle}>
                              {emailError}
                            </MyAppText>
                            <Form>
                              <Item>
                                <Input
                                  placeholder="Email"
                                  value={this.state.email}
                                  onChangeText={this.emailInput}
                                />
                              </Item>
                              <Item>
                                <Input
                                  secureTextEntry
                                  placeholder="Password"
                                  value={this.state.password}
                                  onChangeText={this.passwordInput}
                                />
                              </Item>
                              <ApolloConsumer>
                                {client => (
                                  <Button
                                    style={styles.signInButton}
                                    block
                                    onPress={() => {
                                      const { email, password } = this.state;
                                      this.setError('');
                                      emailLogin({
                                        email,
                                        password,
                                        client,
                                        startSetId,
                                        startNewUser,
                                      }).then(e => this.setError(e));
                                    }}
                                  >
                                    <Text>
                                      { 'Sign in' }
                                    </Text>
                                  </Button>
                                )}
                              </ApolloConsumer>
                            </Form>
                          </View>
                        )}
                      </View>
                    </KeyboardAvoidingView>
                  </ScrollView>
                );
              }}
            </Mutation>
          );
        }}
      </Mutation>
    );
  }
}

const styles = {
  errorTextStyle: {
    fontSize: 20,
    alignSelf: 'center',
    color: 'red',
  },
  emailContainer: {
    // flex: 1,
    margin: 15,
    // justifyContent: 'flex-start',
    // alignItems: 'stretch',
  },
  emailForm: {
  },
  emailFormTitleText: {
    fontSize: 11,
    color: PRIMARY_COLOR,
    alignSelf: 'center',
  },
  buttonFBStyle: {
    backgroundColor: '#4C69BA',
  },
  buttonTextFBStyle: {
    color: '#FFF',
  },
  loginContainer: {
    paddingTop: 100,
    justifyContent: 'flex-start',
    // alignItems: 'center',
    backgroundColor: BACKGROUND_COLOR,
  },
  title: {
    fontSize: 48,
    color: PRIMARY_COLOR,
  },
  subTitle: {
    fontSize: 14,
    marginTop: 5,
    // color: PRIMARY_COLOR,
    fontStyle: 'italic',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInButton: {
    marginTop: 15,
  },
};

export default LoginForm;
