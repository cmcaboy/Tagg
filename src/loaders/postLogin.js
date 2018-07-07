import {db} from '../firebase';
import 'firebase/firestore';
import {dispatch} from 'react-redux';
import {startLoadProfile,startNewUser} from '../actions/profile';
import {startLoading,finishLoading} from '../actions/auth';
import {startInitialSettings} from '../actions/settings';
import {startLoadSettings} from '../actions/settings';
import {startLoadLists,startNewQueue} from '../actions/matchList';
import {Permissions,Location} from 'expo';
import uploadImage from '../firebase/uploadImage';

export const postLogin = (uid,token,dispatch) => {
  // Search firestore to see if uid is registered.
  // If it is not, extract FB details using FB graph API
  // and load it into Firestore.
  // If uid is registered, load the user's information into 
  // the application state using action generators.
  // We will need the facebook token as well
  
  //console.log('user id: ',uid);
  const query = db.collection("users").doc(uid).get()
    .then(async (doc) => {
      dispatch(startLoading());
      if(!doc.exists) {
        // If record does not exist... look data up via FB API
        const response = await fetch(`https://graph.facebook.com/me/?fields=first_name,last_name,picture.height(300),education,about,gender&access_token=${token}`)
        const responseData = await response.json();
        console.log('fb response: ',responseData);

        const responsePhotos = await fetch(`https://graph.facebook.com/me/photos/?fields=source.height(300)&limit=5&access_token=${token}`)
        const responsePhotosData = await responsePhotos.json();
        console.log('fb photo response: ',responsePhotosData);

        let coords;

        await Promise.all(
          Permissions.askAsync(Permissions.LOCATION)
          .then(async ({status}) => {
              if(status === 'granted') {
                console.log('Geolocation permissions granted');
                coords = await Location.getCurrentPositionAsync({});
                console.log('coords: ',coords);
              } else {
                console.log('Geolocation permissions result: ',status);
              }

          })
          .catch((error) => console.warn('error asking Location permission:', error))
        )

        // Consider adding work and acillary pics later
        const newUser = {
          // By default the profilePic property will contain the user's profile pic along with the next
          // 5 photos the user is tagged in.
          profilePic: await uploadImage(responseData.picture.data.url),
          ancillaryPics: await Promise.all(responsePhotosData.data.map(async (datum) => {return await uploadImage(datum.source)})),
          name: responseData.first_name,
          school: responseData.education?responseData.education[responseData.education.length -1].school.name:'',
          description: responseData.about,
          gender: responseData.gender,
          uid,
          coords: coords.coords
        }
        console.log('new user: ',newUser);

        // Define Default Settings
        const initialSettings = {
          sendNotifications: true,
          distance: 20,
          agePreference: [18,35]
        }


        // startNewUser will add the new user to Firestore
        dispatch(startNewUser(newUser));
        dispatch(startInitialSettings(initialSettings,uid))
      }
      // Load the client's profile
      dispatch(startLoadProfile(uid));
      dispatch(startLoadSettings(uid));
      dispatch(finishLoading());
      dispatch(startLoadLists(uid)); // Like, Dislike, Matches
      dispatch(startNewQueue(true));   // Potential List

    })
    .catch((error) => console.log("FB load - Error getting document: ",error))

}

export default postLogin;