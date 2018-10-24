import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  View,
<<<<<<< HEAD
=======
  TextInput,
  LayoutAnimation,
  UIManager,
  Platform,
>>>>>>> temp2
} from 'react-native';
import { Button } from 'native-base';
import { Mutation } from 'react-apollo';
import RadioGroup from 'react-native-radio-buttons-group';
<<<<<<< HEAD
import { PHOTO_HINT, settingDefaults, PRIMARY_COLOR } from '../variables/index';
import { CondInput, Card, MyAppText, Spinner, MyTitleText, CardSection } from './common';
=======
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { PHOTO_HINT, settingDefaults, PRIMARY_COLOR } from '../variables/index';
import { Card, MyAppText, Spinner, MyTitleText, CardSection } from './common';
>>>>>>> temp2
import PhotoSelector from './PhotoSelector';
import { NEW_USER } from '../apollo/mutations';
import toastMessage from '../services/toastMessage';
import emailValidation from '../services/emailValidation';
<<<<<<< HEAD
=======
import emailSignup from '../services/emailSignup';
>>>>>>> temp2

export default class NewUserModal extends Component {
  constructor(props) {
    super(props);

<<<<<<< HEAD
=======
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.spring();

>>>>>>> temp2
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
<<<<<<< HEAD
    };
  }

  changeName = name => this.setState({ name });

  changeEmail = email => this.setState({ email: emailValidation(email.toLowerCase()) });
=======
      password: '',
      validatePassword: '',
    };
  }

  passwordInput = password => this.setState({ password });

  validatePasswordInput = validatePassword => this.setState({ validatePassword });

  changeName = name => this.setState({ name });

  changeEmail = email => this.setState({ email });
>>>>>>> temp2

  changeAge = age => this.setState({ age });

  changeSchool = school => this.setState({ school });

  changeWork = work => this.setState({ work });

  changeDescription = description => this.setState({ description });

  changePics = pics => this.setState({ pics });

  changeGender = gender => this.setState({ gender });

<<<<<<< HEAD
  validateFields = () => {
    // returns true if all fields are validated
    // false if there is a violation
    const { name, gender, email, pics } = this.state;
=======
  validatePassword = () => {
    const { password, validatePassword } = this.state;
    return (password.length && password === validatePassword);
  };

  validateFields = () => {
    // returns true if all fields are validated
    // false if there is a violation
    const { name, gender, email, pics, password } = this.state;
>>>>>>> temp2
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
<<<<<<< HEAD
      this.setState({ error: 'Please specify an email address.' });
=======
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
>>>>>>> temp2
    }
    // all validation fields have passed; return true
    return true;
  }

<<<<<<< HEAD
  // toggleLoading = () => this.setState(prev => ({ loading: !prev.loading }))

  onPressRadioGroup = data => this.setState({ data });

  submitNewUser = (newUser) => {
    this.setState({ loading: true, error: '' });
    const { name, email, age, school, work, description, gender, pics } = this.state;
    const { closeModal } = this.props;
=======
  submitNewUser = (newUser) => {
    this.setState({ loading: true, error: '' });
    const { name, email, age, school, work, description, gender, pics, password } = this.state;
    const { closeModal, startSetId } = this.props;
>>>>>>> temp2

    // validate fields
    if (!this.validateFields()) {
      this.setState({ loading: false });
      return false;
    }

<<<<<<< HEAD
    return newUser({
      variables: {
        id: email,
        name,
        email,
=======
    console.log('validation complete');

    return newUser({
      variables: {
        id: email.toLowerCase(),
        active: true,
        name,
        email: email.toLowerCase(),
>>>>>>> temp2
        age,
        school,
        work,
        description,
        pics,
        gender: gender.filter(g => g.selected)[0].label,
        ...settingDefaults,
      },
<<<<<<< HEAD
      update: (store, data) => {
=======
      update: async (store, data) => {
        console.log('newUser udpate function');
        console.log('data: ', data);
>>>>>>> temp2
        // check for an error
        if (!data) {
          this.setState({ loading: false, error: 'Could not connect to the network' });
          return false;
        }
<<<<<<< HEAD
        // If successful...
        // Present toast message to user confirming success
        toastMessage({
          text: 'Your account has been created!',
        });
        // Close modal
        closeModal();
=======
        // This method can return an error. I need to check for an error before closing the modal
        // and showing the user a sucess confirmation. Consider making this function async
        startSetId(email);

        const checkAuthentication = await emailSignup({ email, password });
        console.log('Check Authentication: ', checkAuthentication);
        if (checkAuthentication) {
          // If the authentication system update fails, remove the user from our records
          this.setState({ loading: false, error: checkAuthentication });
          startSetId(0);
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
>>>>>>> temp2
        return true;
      },
    });
  }

  render() {
<<<<<<< HEAD
    const { settingsContainer, hint } = styles;
    const { pics, name, email, age, school, work, description, gender } = this.state;
    const { closeModal } = this.props;

    console.log('gender: ', gender);
    console.log('pics: ', pics);

    console.log('error: ', this.state.error);
    return (
      <ScrollView contentContainerStyle={settingsContainer}>
=======
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
        // extraHeight={200}
        // extraScrollHeight={200}
      >
>>>>>>> temp2
        <MyTitleText style={{ textDecorationLine: 'underline' }}>
          { 'New Profile Setup' }
        </MyTitleText>
        <Card style={{ padding: 2, marginTop: 15 }}>
<<<<<<< HEAD
          <CardSection>
            <MyAppText>
=======
          <CardSection style={sectionTitle}>
            <MyAppText style={{ fontWeight: 'bold', color: '#FFF' }}>
>>>>>>> temp2
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
<<<<<<< HEAD
          <CardSection>
            <MyAppText>
              { 'Next, tell us about yourself...' }
            </MyAppText>
          </CardSection>
          <CondInput
            field="Name"
            value={name}
            updateValue={this.changeName}
          />
          <CondInput
            field="Email"
            value={email}
            updateValue={this.changeEmail}
            lowerCaseOnly
          />
          <CondInput
            field="Age"
            value={age}
            updateValue={this.changeAge}
          />
          <CondInput
            field="Education"
            value={school}
            updateValue={this.changeSchool}
          />
          <CondInput
            field="Work"
            value={work}
            updateValue={this.changeWork}
          />
          <CondInput
            field="Description"
            value={description}
            updateValue={this.changeDescription}
=======
          <CardSection style={sectionTitle}>
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
>>>>>>> temp2
            multiline
          />
          <CardSection style={{ flexDirection: 'column' }}>
            <MyAppText>
              { 'Gender' }
            </MyAppText>
<<<<<<< HEAD
            <RadioGroup radioButtons={gender} onPress={this.onPressRadioGroup} flexDirection="row" />
          </CardSection>
        </Card>
        {!!this.state.error && (
          <MyAppText style={{ color: 'red', textAlign: 'center', margin: 15 }}>
            { this.state.error }
=======
            <RadioGroup radioButtons={gender} onPress={this.changeGender} flexDirection="row" />
          </CardSection>
        </Card>
        <Card style={{ padding: 0 }}>
          <CardSection style={sectionTitle}>
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
>>>>>>> temp2
          </MyAppText>
        )}
        <Mutation mutation={NEW_USER}>
          {(newUser) => {
<<<<<<< HEAD
            if (this.state.loading) {
=======
            if (loading) {
>>>>>>> temp2
              return <Spinner />;
            }
            return (
              <View>
                <Button
                  block
                  onPress={() => this.submitNewUser(newUser)}
                >
                  <MyAppText
<<<<<<< HEAD
                    style={{ fontWeight: 'bold', color: '#fff', fontSize: 18 }}
=======
                    style={submitButton}
>>>>>>> temp2
                  >
                    { 'Submit' }
                  </MyAppText>
                </Button>
                <TouchableOpacity onPress={closeModal}>
<<<<<<< HEAD
                  <MyAppText style={{ color: PRIMARY_COLOR, margin: 20, textAlign: 'center' }}>
=======
                  <MyAppText style={cancelButton}>
>>>>>>> temp2
                    { 'Cancel' }
                  </MyAppText>
                </TouchableOpacity>
              </View>
            );
          }}
        </Mutation>
<<<<<<< HEAD
      </ScrollView>
=======
        <View style={blankView} />
      </KeyboardAwareScrollView>
>>>>>>> temp2
    );
  }
}

const styles = StyleSheet.create({
  settingsContainer: {
<<<<<<< HEAD
    // justifyContent: 'space-between',
    // alignItems: 'center',
    padding: 10,
  },
  textInputStyle: {
    height: 40,
    width: 100,
    borderColor: 'gray',
    borderWidth: 1,
  },
  cardContainer: {
    width: 300,
    height: 400,
  },
  cardSection: {
    height: 40,
  },
  editView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  img: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    backgroundColor: 'black',
  },
  spinner: {
    width: 150,
    height: 150,
=======
    padding: 10,
  },
  textInputStyle: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#D3D3D3',
    minHeight: 40,
>>>>>>> temp2
  },
  hint: {
    margin: 10,
    fontStyle: 'italic',
    fontSize: 10,
  },
<<<<<<< HEAD
=======
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
>>>>>>> temp2
  errorText: {
    color: 'red',
    textAlign: 'center',
    margin: 15,
  },
<<<<<<< HEAD
=======
  blankView: {
    height: Platform.OS === 'android' ? 200 : 0,
  },
>>>>>>> temp2
});
