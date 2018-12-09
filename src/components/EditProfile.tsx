import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';
import { Query, Mutation } from 'react-apollo';
import {
  Card, Spinner, CondInput, ErrorMessage,
} from './common';
// import { startLogout } from '../actions/auth';
// import {firebase} from '../firebase';
// import expandArrayToFive from '../selectors/expandArrayToFive';
import PhotoSelector from './PhotoSelector';
import { PRIMARY_COLOR, PHOTO_HINT } from '../variables';
// import { GET_ID } from '../apollo/local/queries';
import { GET_EDIT_PROFILE } from '../apollo/queries';
import {
  SET_NAME,
  SET_AGE,
  SET_WORK,
  SET_SCHOOL,
  SET_DESCRIPTION,
  SET_PICS,
  SET_EMAIL,
} from '../apollo/mutations';
import { setPicsVariables, setPics } from '../apollo/mutations/__generated__/setPics';
import { setEmailVariables, setEmail } from '../apollo/mutations/__generated__/setEmail';
import { setAge, setAgeVariables } from '../apollo/mutations/__generated__/setAge';
import { setSchool, setSchoolVariables } from '../apollo/mutations/__generated__/setSchool';
import { setWork, setWorkVariables } from '../apollo/mutations/__generated__/setWork';
import { setDescriptionVariables, setDescription } from '../apollo/mutations/__generated__/setDescription';
import { getEditProfile, getEditProfileVariables, getEditProfile_user } from '../apollo/queries/__generated__/getEditProfile';
import { setName, setNameVariables } from '../apollo/mutations/__generated__/setName';
// import { getId } from '../apollo/queries/__generated__/getId';


class SetPics extends Mutation<setPics, setPicsVariables> {};
class SetName extends Mutation<setName, setNameVariables> {};
class SetEmail extends Mutation<setEmail, setEmailVariables> {};
class SetAge extends Mutation<setAge, setAgeVariables> {};
class SetSchool extends Mutation<setSchool, setSchoolVariables> {};
class SetWork extends Mutation<setWork, setWorkVariables> {};
class SetDescription extends Mutation<setDescription, setDescriptionVariables> {};
class GetEditProfile extends Query<getEditProfile, getEditProfileVariables> {};
// class GetID extends Query<getId, {}> {};

interface UserEditProfile extends getEditProfile_user {
  id: string | null;
  pics: string[] | null[] | null;
  name: string | null;
  age: number | null;
  school: string | null;
  work: string | null;
  description: string | null;
  email: string | null;
}

interface State {};
interface Props {};

class EditProfile extends Component<Props, State> {
  static navigationOptions = () => ({
    title: 'Edit Profile',
    headerRight: <View />,
    headerTitleStyle: {
      alignSelf: 'center',
      textAlign: 'center',
      fontWeight: 'normal',
      fontSize: 22,
      color: PRIMARY_COLOR,
    },
  });

  removeAccount = () => {
    console.log('Remove Account function');
    // this.props.startRemoveProfile();
    // this.props.startLogout();
  };

  renderContent = ({
    name, age, school, work, description, pics = [], id, email,
  }: UserEditProfile)  => {
    console.log('get profile component');
    return (
      <ScrollView contentContainerStyle={styles.settingsContainer}>
        <KeyboardAvoidingView behavior="position">
          <Card style={{ padding: 2 }}>
            <SetPics mutation={SET_PICS}>
              {(changePics) => {
                const startChangePics = ( newPics: string[] ) => changePics({ variables: { id, pics: newPics } });
                return <PhotoSelector urlList={pics} startChangePics={startChangePics} />;
              }}
            </SetPics>
          </Card>
          <Text style={styles.hint}>{PHOTO_HINT}</Text>
          <Card style={{ padding: 0 }}>
            <SetName mutation={SET_NAME}>
              {(changeName) => {
                const startChangeName = ( newName: string ) => changeName({ variables: { id, name: newName } });
                return <CondInput field="Name" value={name} updateValue={startChangeName} />;
              }}
            </SetName>
            <SetEmail mutation={SET_EMAIL}>
              {(changeEmail) => {
                const startChangeEmail = ( newEmail: string ) => changeEmail({ variables: { id, email: newEmail } });
                return (
                  <CondInput
                    field="Email"
                    value={email}
                    updateValue={startChangeEmail}
                    lowerCaseOnly
                  />
                );
              }}
            </SetEmail>
            <SetAge mutation={SET_AGE}>
              {(changeAge) => {
                const startChangeAge = ( newAge: number ) => changeAge({ variables: { id, age: newAge } });
                return <CondInput field="Age" value={age} updateValue={startChangeAge} />;
              }}
            </SetAge>
            {/*
            <CondInput
              field="Gender"
              value={this.props.gender}
              updateValue={this.props.startChangeGender}
            />
            */}
            <SetSchool mutation={SET_SCHOOL}>
              {(changeSchool) => {
                const startChangeSchool = ( newSchool: string ) => changeSchool({ variables: { id, school: newSchool } });
                return (
                  <CondInput field="Education" value={school} updateValue={startChangeSchool} />
                );
              }}
            </SetSchool>
            <SetWork mutation={SET_WORK}>
              {(changeWork) => {
                const startChangeWork = ( newWork: string ) => changeWork({ variables: { id, work: newWork } });
                return <CondInput field="Work" value={work} updateValue={startChangeWork} />;
              }}
            </SetWork>
            <SetDescription mutation={SET_DESCRIPTION}>
              {(changeDescription) => {
                const startChangeDescription = ( newDescription: string ) => changeDescription({
                  variables: { id, description: newDescription },
                });
                return (
                  <CondInput
                    field="Description"
                    value={description}
                    updateValue={startChangeDescription}
                    multiline
                  />
                );
              }}
            </SetDescription>
          </Card>

          {/*
            <Card>
              <FakeButton />
            </Card>
            <Card>
              <Button onPress={this.removeAccount}>Remove Account</Button>
            </Card>
          */}
        </KeyboardAvoidingView>
      </ScrollView>
    );
  };

  render() {
    // return (
    //   <GetID query={GET_ID}>
    //     {({ loading, error, data }) => {
    //       // console.log('local data: ',data);
    //       // console.log('local error: ',error);
    //       // console.log('local loading: ',loading);
    //       if (loading) return <Spinner />;
    //       if (error) return <ErrorMessage error={error.message} />;

    //       const { id } = data.user;

          return (
            <GetEditProfile query={GET_EDIT_PROFILE}>
              {({ loading, error, data }) => {
                // console.log('data: ',data);
                // console.log('error: ',error);
                // console.log('loading: ',loading);
                if (loading) return <Spinner />;
                if (error) return <ErrorMessage error={error.message} />;
                return this.renderContent(data.user);
              }}
            </GetEditProfile>
          );
    //     }}
    //   </GetID>
    // );
  }
}

interface Style {
  settingsContainer: ViewStyle;
  textInputStyle: TextStyle;
  cardContainer: ViewStyle;
  cardSection: ViewStyle;
  editView: ViewStyle;
  img: ImageStyle;
  spinner: ImageStyle;
  hint: TextStyle;
}
const styles = StyleSheet.create<Style>({
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
    marginBottom: 10,
    fontStyle: 'italic',
    fontSize: 11,
  },
});

export default EditProfile;
