import {firebase} from '../firebase';

export const checkPermissions = async () => {
  const enabled = await firebase.messaging().hasPermission();
  if(enabled) {
    console.log('User has permissions');
    return enabled;
  } else {
    // Ask for permissiosn
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
      console.log('Push Notification Authorization granted.');
      return true;
    } catch (error) {
        // User has rejected permissions
        console.log('Push Notification Authorization denied')
        return false;
    }
  }
}

export const onReceiveNotification = () => {}

