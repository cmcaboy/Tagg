import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
  LayoutAnimation,
  UIManager,
  Platform,
  ViewStyle,
  TextStyle,
  AsyncStorage,
} from 'react-native';
import { Button } from 'native-base';
import { Mutation } from 'react-apollo';
import RadioGroup, { GroupItem } from 'react-native-radio-buttons-group';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { PHOTO_HINT, settingDefaults, PRIMARY_COLOR } from '../variables/index';
import { Card, MyAppText, Spinner, MyTitleText, CardSection } from './common';
import PhotoSelector from './PhotoSelector';
import { NEW_USER } from '../apollo/mutations';
import toastMessage from '../services/toastMessage';
import emailValidation from '../services/emailValidation';
import emailSignup from '../services/emailSignup';
import { newUser, newUserVariables } from '../apollo/mutations/__generated__/newUser';

interface Props {
  closeModal: () => void;
  // startSetId: (id: string | number) => void;
}

// Need to check how to overload typescript intefaces
// ---------------------------------
// interface GenderItem extends GroupItem {
//   label: 'female' | 'male';
//   selected: boolean;
// }

interface State {
  pics: string[],
  gender: GroupItem[];
  name: string;
  email: string;
  age: string;
  school: string;
  work: string;
  description: string;
  loading: boolean;
  error: string;
  password: string;
  validatePassword: string;
}

class NewUser extends Mutation<newUser, newUserVariables> {};

export default class NewUserModal extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.spring();

    this.state = {
      pics: [], // Must use at least 1 image
      gender: [
        {
          label: 'female',
          selected: false,
        },
        {
          label: 'male',
          selected: false,
        },
      ],
      name: '', // Must be at least 1 letter
      email: '', // must be valid email address
      age: '', // optional
      school: '', // optional
      work: '', // optional
      description: '', // optional
      loading: false,
      error: '',
      password: '',
      validatePassword: '',
    };
  }

  passwordInput = ( password: string ) => this.setState({ password });

  validatePasswordInput = ( validatePassword: string ) => this.setState({ validatePassword });

  changeName = ( name: string ) => this.setState({ name });

  changeEmail = ( email: string ) => this.setState({ email });

  changeAge = (age: string) => this.setState({ age });

  changeSchool = ( school: string ) => this.setState({ school });

  changeWork = ( work: string ) => this.setState({ work });

  changeDescription = ( description: string ) => this.setState({ description });

  changePics = (pics: string[]) => this.setState({ pics });

  changeGender = ( gender: GroupItem[] ) => this.setState({ gender });

  validatePassword = () => {
    const { password, validatePassword } = this.state;
    return (password.length && password === validatePassword);
  };

  validateFields = () => {
    // returns true if all fields are validated
    // false if there is a violation
    const { name, gender, email, pics, password } = this.state;
    console.log('validate fields');
    if (!name) {
      this.setState({ error: 'Please specify a name.' });
      return false;
    }
    if (!gender) {
      this.setState({ error: 'Please specify a valid gender' });
      return false;
    }
    if (!pics.length) {
      this.setState({ error: 'Please upload at least 1 picture' });
      return false;
    }
    if (!emailValidation(email)) {
      console.log('email: ', email);
      console.log('email test: ', emailValidation(email));
      this.setState({ error: 'Please specify a valid email address.' });
      return false;
    }
    if (!password.length) {
      console.log('no password inputted');
      this.setState({ error: 'Please specify a password.' });
      return false;
    }
    if (!this.validatePassword()) {
      console.log('passwords do not match!');
      this.setState({ error: 'Passwords do not match!' });
      return false;
    }
    // all validation fields have passed; return true
    return true;
  }

  submitNewUser = (newUser: (user: any) => void) => {
    this.setState({ loading: true, error: '' });
    const { name, age, school, work, description, gender, pics, password } = this.state;
    let { email } = this.state;
    email = email.toLowerCase();

    const { closeModal } = this.props;

    // validate fields
    if (!this.validateFields()) {
      this.setState({ loading: false });
      return false;
    }

    console.log('validation complete');

    return newUser({
      variables: {
        name,
        email,
        age,
        school,
        work,
        description,
        pics,
        id: email.toLowerCase(),
        active: true,
        gender: gender.filter(g => g.selected)[0].label,
        ...settingDefaults,
      },
      update: async (_: any, data: any) => {
        console.log('newUser udpate function');
        console.log('data: ', data);
        // check for an error
        if (!data) {
          this.setState({ loading: false, error: 'Could not connect to the network' });
          return false;
        }
        // This method can return an error. I need to check for an error before closing the modal
        // and showing the user a sucess confirmation. Consider making this function async
        // startSetId(email); // replaced with asyncstorage
        await AsyncStorage.setItem("TaggToken", email);
        
        const checkAuthentication = await emailSignup({ email, password });
        console.log('Check Authentication: ', checkAuthentication);
        if (checkAuthentication) {
          // If the authentication system update fails, remove the user from our records
          this.setState({ loading: false, error: checkAuthentication });
          await AsyncStorage.setItem("TaggToken", email);
          // startSetId(0); // replace with AsyncStorage
          // Need to add a function to remove the user in the event of a failure here
          return null;
        }

        // If successful...
        // Present toast message to user confirming success
        console.log('before toastMessage');
        toastMessage({
          text: 'Your account has been created!',
        });
        console.log('after toast message');
        // Close modal
        closeModal();
        console.log('after close modal');
        return true;
      },
    });
  }

  render() {
    const {
      settingsContainer,
      hint,
      sectionTitle,
      textInputStyle,
      submitButton,
      cancelButton,
      errorText,
      blankView,
    } = styles;
    const {
      pics,
      name,
      email,
      age,
      school,
      work,
      description,
      gender,
      password,
      validatePassword,
      loading,
      error,
    } = this.state;
    const { closeModal } = this.props;
    console.log('pics: ', pics);

    return (
      <KeyboardAwareScrollView
        contentContainerStyle={settingsContainer}
        scrollEnabled
        enableAutomaticScroll
        enableOnAndroid
        keyboardShouldPersistTaps="always"
        // extraHeight={200}
        // extraScrollHeight={200}
      >
        <MyTitleText style={{ textDecorationLine: 'underline' }}>
          { 'New Profile Setup' }
        </MyTitleText>
        <Card style={{ padding: 2, marginTop: 15 }}>
          <CardSection style={sectionTitle as ViewStyle}>
            <MyAppText style={{ fontWeight: 'bold', color: '#FFF' }}>
              { 'First, Upload a few pictures. Click on a plus image to upload a new image.' }
            </MyAppText>
          </CardSection>
          <PhotoSelector
            urlList={pics}
            startChangePics={this.changePics}
          />
          <Text style={hint}>
            {PHOTO_HINT}
          </Text>
        </Card>
        <Card style={{ padding: 0 }}>
          <CardSection style={sectionTitle as ViewStyle}>
            <MyAppText style={{ fontWeight: 'bold', color: '#FFF' }}>
              { 'Next, tell us about yourself...' }
            </MyAppText>
          </CardSection>
          <TextInput
            placeholder="Email"
            placeholderTextColor="red" // Red color indicates required field
            value={email}
            onChangeText={this.changeEmail}
            style={[textInputStyle, { opacity: email.length ? 1 : 0.4 }]}
          />
          <TextInput
            placeholder="Name"
            placeholderTextColor="red" // Red color indicates required field
            value={name}
            onChangeText={this.changeName}
            style={[textInputStyle, { opacity: name.length ? 1 : 0.4 }]}
          />
          <TextInput
            placeholder="Age"
            value={age}
            onChangeText={this.changeAge}
            style={textInputStyle}
          />
          <TextInput
            placeholder="Education"
            value={school}
            onChangeText={this.changeSchool}
            style={textInputStyle}
          />
          <TextInput
            placeholder="Work"
            value={work}
            onChangeText={this.changeWork}
            style={textInputStyle}
          />
          <TextInput
            placeholder="Description"
            style={textInputStyle}
            value={description}
            onChangeText={this.changeDescription}
            multiline
          />
          <CardSection style={{ flexDirection: 'column' }}>
            <MyAppText>
              { 'Gender' }
            </MyAppText>
            <RadioGroup radioButtons={gender} onPress={this.changeGender} flexDirection="row" />
          </CardSection>
        </Card>
        <Card style={{ padding: 0 }}>
          <CardSection style={sectionTitle as TextStyle}>
            <MyAppText style={{ fontWeight: 'bold', color: '#FFF' }}>
              { 'Finally, create a password.' }
            </MyAppText>
          </CardSection>
          <CardSection style={{ flexDirection: 'column' }}>
            <TextInput
              style={textInputStyle}
              secureTextEntry
              placeholder="Password"
              value={password}
              onChangeText={this.passwordInput}
            />
            <TextInput
              secureTextEntry
              style={textInputStyle}
              placeholder="Re-enter Password"
              value={validatePassword}
              onChangeText={this.validatePasswordInput}
            />
          </CardSection>
        </Card>
        {!!error && (
          <MyAppText style={errorText}>
            { error }
          </MyAppText>
        )}
        <NewUser mutation={NEW_USER}>
          {(newUser) => {
            if (loading) {
              return <Spinner />;
            }
            return (
              <View>
                <Button
                  block
                  onPress={() => this.submitNewUser(newUser)}
                >
                  <MyAppText
                    style={submitButton}
                  >
                    { 'Submit' }
                  </MyAppText>
                </Button>
                <TouchableOpacity onPress={closeModal}>
                  <MyAppText style={cancelButton}>
                    { 'Cancel' }
                  </MyAppText>
                </TouchableOpacity>
              </View>
            );
          }}
        </NewUser>
        <View style={blankView} />
      </KeyboardAwareScrollView>
    );
  }
}

interface Style {
  settingsContainer: ViewStyle;
  textInputStyle: ViewStyle;
  hint: TextStyle;
  sectionTitle: ViewStyle;
  cancelButton: TextStyle;
  submitButton: TextStyle;
  errorText: TextStyle;
  blankView: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  settingsContainer: {
    padding: 10,
  },
  textInputStyle: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#D3D3D3',
    minHeight: 40,
  },
  hint: {
    margin: 10,
    fontStyle: 'italic',
    fontSize: 10,
  },
  sectionTitle: {
    backgroundColor: '#000',
    overflow: 'hidden',
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
  },
  cancelButton: {
    color: PRIMARY_COLOR,
    margin: 20,
    textAlign: 'center',
  },
  submitButton: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 18,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    margin: 15,
  },
  blankView: {
    height: Platform.OS === 'android' ? 200 : 0,
  },
});
