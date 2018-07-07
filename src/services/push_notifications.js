import { Permissions, Notifications } from 'expo';
import { AsyncStorage } from 'react-native';
import {db} from '../firebase';

const PUSH_ENDPOINT = '';
const LOCAL_STORAGE_LOCATION = 'pushtoken_stagg';

export default async (id,startSetPushToken) => {
  //let previousToken = await AsyncStorage.getItem(LOCAL_STORAGE_LOCATION);
  // if (previousToken) {
  //   return;
  // } else {
    let {status} = await Permissions.askAsync(Permissions.NOTIFICATIONS);

    console.log('push notification status: ',status);

    if(status !== 'granted') {
      // user did not get us permissions to send notifications
      return;
    }
    // generate an authorizing token for this user.
    let token = await Notifications.getExpoPushTokenAsync();

    //await db.collection(`users`).doc(`${id}`).update({token}); 
    await startSetPushToken(token);
    //axios.post(PUSH_ENDPOINT, {token: {token}});
    //AsyncStorage.setItem(LOCAL_STORAGE_LOCATION,token);
  //}
}