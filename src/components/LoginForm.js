import React, { Component } from 'react';
// import firebase from 'firebase';
import {
  View,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  KeyboardAvoidingView,
} from 'react-native';
import { ApolloConsumer, Mutation } from 'react-apollo';
import { Form, Item, Input, Button, Text } from 'native-base';
import { CardSection, MyAppText, MyAppModal, Spinner } from './common';
import { PRIMARY_COLOR, BACKGROUND_COLOR, DEFAULT_LATITUDE, DEFAULT_LONGITUDE } from '../variables';
import { getCurrentTime } from '../format';
import FBLoginButton from '../services/FBLoginButton';
import { NEW_USER } from '../apollo/mutations';
import { SET_ID_LOCAL } from '../apollo/local/mutations';
import emailLogin from '../services/emailLogin';
import emailSignup from '../services/emailSignup';
import checkEmail from '../services/checkEmail';
import NewUserModal from './NewUserModal';
import emailValidation from '../services/emailValidation';

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
      loading: false,
      showEmail: false,
      modalDisplay: false,
    };
  }

  toggleEmail = () => this.setState(prev => ({ showEmail: !prev.showEmail }))

  emailInput = email => this.setState({ email: email.toLowerCase() })

  passwordInput = password => this.setState({ password });

  setError = e => this.setState({ emailError: e });

  modalClose = () => this.setState({ modalDisplay: false });

  emailLogin = async ({ startSetId, client }) => {
    const { email, password } = this.state;

    // Display a loading spinner and remove error display
    this.setState({ loading: true });
    this.setError('');

    // Check to see if format of email is valid
    if (!emailValidation(email)) {
      this.setError('Invalid Email format. Please use a valid email.');
      this.setState({ loading: false });
      return false;
    }

    // Check to see if email is already on file
    const isEmailAlreadyRegistered = await checkEmail({ email, client });
    console.log('isEmailAlreadyRegistered: ', isEmailAlreadyRegistered);
    if (!isEmailAlreadyRegistered) {
      this.setError('We could not find your email. Please try a different one or use facebook to login.');
      this.setState({ loading: false });
      return null;
    }

    // Attempt login
    emailLogin({
      email,
      password,
      client,
      startSetId,
    }).then((e) => {
      this.setState({ loading: false });
      this.setError(e);
    }).catch((e) => {
      console.log('email login error: ', e);
      this.setState({ loading: false });
      this.setError(e);
    });
  }

  emailSignup = async ({ client }) => {
    const { email } = this.state;
    this.setError('');
    // Check to see if email is already in file
    const isEmailAlreadyRegistered = await checkEmail({ email, client });
    console.log('isEmailAlreadyRegistered: ', isEmailAlreadyRegistered);
    if (isEmailAlreadyRegistered) {
      this.setError('This email address is already in use. Choose another one or login with Facebook');
      return null;
    }
    // If it is not, gather information on client
    // activate modal
    this.setState({ modalDisplay: true, loading: false });
  }

  completeEmailSignupAuth = async ({ startSetId }) => {
    const { email, password } = this.state;
    // Upload new data to our database; Do not continue until successful confirmation is returned

    // Set local state id
    startSetId(email);

    // Finally, register the user in our authentication system
    const checkAuthentication = await emailSignup({ email, password });
    if (checkAuthentication) {
      // If the authentication system update fails, remove the user from our records
      this.setError('Unfortunately, we could not register email your email at this time');
      startSetId(0);
      // Need to add a function to remove the user in the event of a failure here
      return null;
    }
    // If you made it this far, everything has worked out!
    return true;
  }

  componentWillUpdate = () => {
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.linear();
  }

  render() {
    const { error, emailError } = this.state;
    const { signUp, signContainer } = styles;
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
                const startSetId = (id) => {
                  console.log('set id: ', id);
                  setId({ variables: { id } });
                };
                return (
                  <KeyboardAvoidingView
                    style={styles.loginContainer}
                    behavior="padding"
                    enabled
                  >
                    <MyAppModal
                      isVisible={this.state.modalDisplay}
                      close={this.modalClose}
                      swipeToClose={false}
                    >
                      <NewUserModal
                        closeModal={this.modalClose}
                        startSetId={startSetId}
                        completeEmailSignupAuth={() => this.completeEmailSignupAuth({ startSetId })}
                      />
                    </MyAppModal>
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
                              {(client) => {
                                if (this.state.loading) {
                                  return <Spinner />;
                                }
                                return (
                                  <View style={signContainer}>
                                    <Button
                                      style={styles.signInButton}
                                      block
                                      onPress={() => this.emailLogin({ client, startSetId })}
                                    >
                                      <Text>
                                        { 'Sign in' }
                                      </Text>
                                    </Button>
                                    <TouchableOpacity onPress={() => this.emailSignup({ client, startSetId, startNewUser })}>
                                      <MyAppText style={signUp}>
                                        { 'Sign up' }
                                      </MyAppText>
                                    </TouchableOpacity>
                                  </View>
                                );
                              }}
                            </ApolloConsumer>
                          </Form>
                        </View>
                      )}
                    </View>
                  </KeyboardAvoidingView>
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
    fontSize: 16,
    alignSelf: 'center',
    textAlign: 'center',
    color: 'red',
    marginTop: 15,
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
    // display: 'none',
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
  signUp: {
    margin: 30,
    color: PRIMARY_COLOR,
  },
  signContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default LoginForm;
