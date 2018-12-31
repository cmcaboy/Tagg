import React, { Component } from 'react';
import { View, AsyncStorage } from 'react-native';
import { LoginButton, AccessToken } from 'react-native-fbsdk';
import gql from 'graphql-tag';
import { ApolloClient } from 'apollo-client';
import { firebase, analytics } from '../firebase';
import uploadImage from '../firebase/uploadImage';
import { DEFAULT_LATITUDE, DEFAULT_LONGITUDE } from '../variables';
import { Spinner } from '../components/common';

interface Props {
  startNewUser: (user: any) => void;
  // startSetId: (id: string | number) => void; // replaced with asyncstorage
  client: ApolloClient<any>;
  setError: (error: any) => void;
  setLoading: (loading: boolean) => void;
}
interface State {
  loading: boolean;
}

const GET_EMAIL_BY_TOKEN = gql`
  query user($id: String!) {
    user(id: $id) {
      email
    }
  }
`;

class FBLoginButton extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      loading: false,
    };
  }

  render() {
    const {
      startNewUser,
      setError,
      setLoading,
      // startSetId, // replace with asyncstoarge
      client: { query, writeData },
    } = this.props;
    const { loading } = this.state;
    if (loading) return <Spinner />;
    return (
      <View>
        <LoginButton
          readPermissions={['public_profile', 'email']}
          onLoginFinished={async (error, result) => {
            analytics.logEvent('Click_FB_login');
            this.setState({ loading: true });
            console.log('error: ', error);
            console.log('result: ', result);
            if (error) {
              console.log('Login failed with error: ', error);
              setError(error);
              setLoading(false);
              return;
            }
            if (result.isCancelled) {
              analytics.logEvent('Event_FB_login_cancelled');
              console.log('Login was cancelled');
              setLoading(false);
              return;
            }

            const tokenRaw = await AccessToken.getCurrentAccessToken();
            const token = tokenRaw.accessToken.toString();

            console.log('token: ', token);

            // Determine if user is registered.

            // const provider = firebase.auth.FacebookAuthProvider;
            // const credential = provider.credential(token);
            const credential = firebase.auth.FacebookAuthProvider.credential(tokenRaw.accessToken);

            const responseEmailRaw = await fetch(
              `https://graph.facebook.com/me/?fields=email&access_token=${token}`,
            );
            const responseEmail = await responseEmailRaw.json();
            let { email } = responseEmail;
            let isRegistered;

            try {
              // Login via Firebase Auth
              // email = result.additionalUserInfo.profile.email;

              console.log('email: ', email);

              // await AsyncStorage.setItem('TaggToken', email);

              const { data, errors }: { data: any; errors?: any } = await query({
                query: GET_EMAIL_BY_TOKEN,
                variables: { id: email },
                fetchPolicy: 'no-cache',
              });
              console.log('data: ', data);
              console.log('errors: ', errors);
              isRegistered = data.user ? !!data.user.email : false;
              console.log('isRegistered: ', isRegistered);
            } catch (e) {
              console.log('error: ', e);
              setLoading(false);
              // await AsyncStorage.setItem('TaggToken', '0');
              // await firebase.auth().signOut();
              return setError('Cannot connect to network');
              // email = null;
              // isRegistered = false;
            }

            await firebase.auth().signInWithCredential(credential);

            // If we do not have record of the user's email, this is a new user.
            // We should build their profile from their facebook profile
            if (!isRegistered) {
              analytics.logEvent('Event_FB_login_newUser');
              console.log('new user');
              // An alternative approach would be to run this all on the graphql server
              const responseRaw = await fetch(
                `https://graph.facebook.com/me/?fields=first_name,last_name,picture.height(300),education,about,gender,email&access_token=${token}`,
              );
              const response = await responseRaw.json();

              console.log('response: ', response);

              const photosRaw = await fetch(
                `https://graph.facebook.com/me/photos/?fields=source.height(300)&limit=5&access_token=${token}`,
              );
              const photos = await photosRaw.json();

              console.log('photos: ', photos);

              const profilePic = await uploadImage(response.picture.data.url);
              const ancillaryPics = await Promise.all(
                photos.data.map(async (datum: any) => await uploadImage(datum.source)),
              );

              // const ancillaryPics = [];
              const pics = [profilePic, ...ancillaryPics];

              const newUser = {
                // By default the profilePic property will contain the
                // user's profile pic along with the next
                // 5 photos the user is tagged in.
                pics,
                name: response.first_name,
                active: true,
                school: response.education
                  ? response.education[response.education.length - 1].school.name
                  : '',
                description: response.about,
                gender: response.gender ? response.gender : 'male',
                email: response.email,
                id: response.email,
                latitude: DEFAULT_LATITUDE,
                longitude: DEFAULT_LONGITUDE,
                // coords: coords.coords,
                sendNotifications: true, // default
                distance: 15, // default
                minAgePreference: 18, // default
                maxAgePreference: 28, // default
                // followerDisplay: 'Both', // setting this in LoginForm Compononent
              };

              email = response.email;

              console.log('newUser: ', newUser);

              // Load up new user in our database
              await startNewUser(newUser);
            }

            // await startSetId(email);
            await AsyncStorage.setItem('TaggToken', email);
            await writeData({ data: { isLoggedIn: true } });

            analytics.logEvent('Event_FB_login_success');
            this.setState({ loading: false });
            console.log('fb login complete');
          }}
          onLogoutFinished={async () => {
            firebase.auth().signOut();
            // await startSetId(0);
            await AsyncStorage.removeItem('TaggToken');
            await writeData({ data: { isLoggedIn: false } });
          }}
        />
      </View>
    );
  }
}

export default FBLoginButton;
