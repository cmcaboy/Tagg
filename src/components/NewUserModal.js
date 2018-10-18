import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button } from 'native-base';
import { Mutation } from 'react-apollo';
import RadioGroup from 'react-native-radio-buttons-group';
import { PHOTO_HINT, settingDefaults, PRIMARY_COLOR } from '../variables/index';
import { CondInput, Card, MyAppText, Spinner, MyTitleText, CardSection } from './common';
import PhotoSelector from './PhotoSelector';
import { NEW_USER } from '../apollo/mutations';
import toastMessage from '../services/toastMessage';
import emailValidation from '../services/emailValidation';

export default class NewUserModal extends Component {
  constructor(props) {
    super(props);

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
    };
  }

  changeName = name => this.setState({ name });

  changeEmail = email => this.setState({ email: email.toLowerCase() });

  changeAge = age => this.setState({ age });

  changeSchool = school => this.setState({ school });

  changeWork = work => this.setState({ work });

  changeDescription = description => this.setState({ description });

  changePics = pics => this.setState({ pics });

  changeGender = gender => this.setState({ gender });

  validateFields = () => {
    // returns true if all fields are validated
    // false if there is a violation
    const { name, gender, email, pics } = this.state;
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
    // all validation fields have passed; return true
    return true;
  }

  // toggleLoading = () => this.setState(prev => ({ loading: !prev.loading }))

  onPressRadioGroup = data => this.setState({ data });

  submitNewUser = (newUser) => {
    this.setState({ loading: true, error: '' });
    const { name, email, age, school, work, description, gender, pics } = this.state;
    const { closeModal } = this.props;

    // validate fields
    if (!this.validateFields()) {
      this.setState({ loading: false });
      return false;
    }

    console.log('validation complete');

    newUser({
      variables: {
        id: email,
        active: true,
        name,
        email,
        age,
        school,
        work,
        description,
        pics,
        gender: gender.filter(g => g.selected)[0].label,
        ...settingDefaults,
      },
      update: (store, data) => {
        console.log('newUser udpate function');
        console.log('data: ', data);
        // check for an error
        if (!data) {
          this.setState({ loading: false, error: 'Could not connect to the network' });
          return false;
        }
        // If successful...
        // Present toast message to user confirming success
        toastMessage({
          text: 'Your account has been created!',
        });
        // Close modal
        closeModal();
        return true;
      },
    });
  }

  render() {
    const { settingsContainer, hint } = styles;
    const { pics, name, email, age, school, work, description, gender } = this.state;
    const { closeModal } = this.props;

    console.log('gender: ', gender);
    console.log('pics: ', pics);

    console.log('error: ', this.state.error);
    return (
      <ScrollView contentContainerStyle={settingsContainer}>
        <MyTitleText style={{ textDecorationLine: 'underline' }}>
          { 'New Profile Setup' }
        </MyTitleText>
        <Card style={{ padding: 2, marginTop: 15 }}>
          <CardSection>
            <MyAppText style={{ fontWeight: 'bold' }}>
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
          <CardSection>
            <MyAppText style={{ fontWeight: 'bold' }}>
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
            multiline
          />
          <CardSection style={{ flexDirection: 'column' }}>
            <MyAppText>
              { 'Gender' }
            </MyAppText>
            <RadioGroup radioButtons={gender} onPress={this.onPressRadioGroup} flexDirection="row" />
          </CardSection>
        </Card>
        {!!this.state.error && (
          <MyAppText style={{ color: 'red', textAlign: 'center', margin: 15 }}>
            { this.state.error }
          </MyAppText>
        )}
        <Mutation mutation={NEW_USER}>
          {(newUser) => {
            if (this.state.loading) {
              return <Spinner />;
            }
            return (
              <View>
                <Button
                  block
                  onPress={() => this.submitNewUser(newUser)}
                >
                  <MyAppText
                    style={{ fontWeight: 'bold', color: '#fff', fontSize: 18 }}
                  >
                    { 'Submit' }
                  </MyAppText>
                </Button>
                <TouchableOpacity onPress={closeModal}>
                  <MyAppText style={{ color: PRIMARY_COLOR, margin: 20, textAlign: 'center' }}>
                    { 'Cancel' }
                  </MyAppText>
                </TouchableOpacity>
              </View>
            );
          }}
        </Mutation>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  settingsContainer: {
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
  },
  hint: {
    margin: 10,
    fontStyle: 'italic',
    fontSize: 10,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    margin: 15,
  },
});
