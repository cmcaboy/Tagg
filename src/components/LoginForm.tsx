import React, { Component } from 'react';
// import firebase from 'firebase';
import {
  View, TouchableOpacity, LayoutAnimation, UIManager, ViewStyle, TextStyle, StyleSheet,
} from 'react-native';
import { ApolloConsumer, Mutation } from 'react-apollo';
import {
  Form, Item, Input, Button, Text,
} from 'native-base';
import SplashScreen from 'react-native-splash-screen';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  CardSection, MyAppText, MyAppModal, Spinner,
} from './common';
import {
  PRIMARY_COLOR, BACKGROUND_COLOR, DEFAULT_LATITUDE, DEFAULT_LONGITUDE,
} from '../variables';
// import { getCurrentTime } from '../format';
import FBLoginButton from '../services/FBLoginButton';
import { NEW_USER } from '../apollo/mutations';
import { SET_ID_LOCAL } from '../apollo/local/mutations';
import emailLogin from '../services/emailLogin';
import checkEmail from '../services/checkEmail';
import NewUserModal from './NewUserModal';
import emailValidation from '../services/emailValidation';
import { newUser, newUserVariables } from '../apollo/mutations/__generated__/newUser';
import { setId, setIdVariables } from '../apollo/local/mutations/__generated__/setId';

interface Props {};

interface State {
  email: string;
  password: string;
  error: string;
  emailError: string;
  loading: boolean;
  showEmail: boolean;
  modalDisplay: boolean;
}

class NewUser extends Mutation<newUser, newUserVariables> {};
class SetId extends Mutation<setId, setIdVariables> {};

class LoginForm extends Component<Props, State> {
  constructor(props: Props) {
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

  toggleEmail = () => this.setState(prev => ({ showEmail: !prev.showEmail }));

  emailInput = ( email: string ) => this.setState({ email });

  passwordInput = ( password: string ) => this.setState({ password });

  setError = ( e: string ) => this.setState({ emailError: e });

  modalClose = () => this.setState({ modalDisplay: false });

  emailLogin = async ({ startSetId, client }: { startSetId: (id: string) => void; client: any }) => {
    const { email, password } = this.state;

    // Display a loading spinner and remove error display
    this.setState({ loading: true, error: '' });

    // Check to see if format of email is valid
    if (!emailValidation(email)) {
      this.setState({ loading: false, error: 'Invalid Email format. Please use a valid email.' });
      return false;
    }

    // Check to see if email is already on file
    const isEmailAlreadyRegistered = await checkEmail({
      email: email.toLowerCase(),
      client,
    });
    console.log('isEmailAlreadyRegistered: ', isEmailAlreadyRegistered);
    if (!isEmailAlreadyRegistered) {
      this.setError(
        'We could not find your email. Please try a different one or use facebook to login.',
      );
      this.setState({ loading: false });
      return null;
    }

    // Attempt login
    // If login is successful, the user is automatically routed to the functioning app (Stagg component)
    emailLogin({
      email: email.toLowerCase(),
      password,
      startSetId,
    })
      .then(error => this.setState({ loading: false, error }))
      .catch((e) => {
        console.log('email login error: ', e);
        this.setState({ loading: false, error: e });
      });
    return null;
  };

  // activate modal - Modal is activated when modalDisplay is set to true
  emailSignup = () => this.setState({ error: '', modalDisplay: true, loading: false });

  componentWillUpdate = () => {
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.linear();
  };

  // Hides default splash screen when the page is mounted.
  componentDidMount = () => SplashScreen.hide();

  render() {
    const { error, emailError } = this.state;
    const { signUp, signContainer } = styles;
    return (
      <NewUser mutation={NEW_USER}>
        {(newUser) => {
          const startNewUser = ( user: any ) => newUser({
            variables: {
              id: user.id,
              name: user.name,
              active: user.active,
              email: user.email.toLowerCase(),
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
              // registerDateTime: getCurrentTime(),
              followerDisplay: 'Both', // default
            },
          });
          return (
            <SetId mutation={SET_ID_LOCAL}>
              {(setId) => {
                const startSetId = (id: string | number) => {
                  console.log('set id: ', id);
                  setId({ variables: { id } });
                };
                return (
                  <KeyboardAwareScrollView
                    contentContainerStyle={styles.loginContainer as ViewStyle}
                    scrollEnabled
                    enableOnAndroid
                    enableAutomaticScroll
                    keyboardShouldPersistTaps="always"
                  >
                    <MyAppModal
                      isVisible={this.state.modalDisplay}
                      close={this.modalClose}
                      swipeToClose={false}
                    >
                      <NewUserModal closeModal={this.modalClose} startSetId={startSetId} />
                    </MyAppModal>
                    <View style={styles.content}>
                      <MyAppText style={styles.title}>Tagg</MyAppText>
                      <MyAppText style={styles.subTitle}>Find a date...... Fast!</MyAppText>
                      <MyAppText style={styles.errorTextStyle}>{error}</MyAppText>
                      <CardSection style={{ borderBottomWidth: 0 }}>
                        <ApolloConsumer>
                          {client => (
                            <FBLoginButton
                              client={client}
                              startNewUser={startNewUser}
                              startSetId={startSetId}
                            />
                          )}
                        </ApolloConsumer>
                      </CardSection>
                    </View>
                    <View style={styles.emailContainer}>
                      <TouchableOpacity onPress={this.toggleEmail}>
                        <Text style={styles.emailFormTitleText}>Use Email Instead</Text>
                      </TouchableOpacity>
                      {this.state.showEmail && (
                        <View style={styles.emailForm}>
                          <MyAppText style={styles.errorTextStyle}>{emailError}</MyAppText>
                          <Form>
                            <Item>
                              <Input
                                autoCapitalize="none"
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
                                      style={styles.signInButton as ViewStyle}
                                      block
                                      onPress={() => this.emailLogin({ client, startSetId })}
                                    >
                                      <Text>Sign in</Text>
                                    </Button>
                                    <TouchableOpacity
                                      onPress={() => this.emailSignup()}
                                    >
                                      <MyAppText style={signUp}>Sign up with Email</MyAppText>
                                    </TouchableOpacity>
                                  </View>
                                );
                              }}
                            </ApolloConsumer>
                          </Form>
                        </View>
                      )}
                    </View>
                  </KeyboardAwareScrollView>
                );
              }}
            </SetId>
          );
        }}
      </NewUser>
    );
  }
}

interface Style {
  errorTextStyle: TextStyle;
  emailContainer: ViewStyle;
  emailForm: ViewStyle;
  emailFormTitleText: TextStyle;
  buttonFBStyle: ViewStyle;
  buttonTextFBStyle: TextStyle;
  loginContainer: ViewStyle;
  title: TextStyle;
  subTitle: TextStyle;
  content: ViewStyle;
  signInButton: ViewStyle;
  signUp: TextStyle;
  signContainer: ViewStyle;
}

const styles = StyleSheet.create<Style>({
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
  emailForm: {},
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
});

export default LoginForm;
