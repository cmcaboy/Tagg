import { NavigationScreenProp, NavigationRoute } from 'react-navigation';
import { firebase } from '../firebase';

export const checkPermissions = async () => {
  const enabled = await firebase.messaging().hasPermission();
  if (enabled) {
    // console.log('User has permissions');
    return enabled;
  }
  // Ask for permissiosn
  try {
    await firebase.messaging().requestPermission();
    // User has authorised
    console.log('Push Notification Authorization granted.');
    return true;
  } catch (error) {
    // User has rejected permissions
    console.log('Push Notification Authorization denied');
    return false;
  }
};

export const onReceiveNotification = () => {};

export const pushNotificationHandler = (
  id: string,
  data: any,
  navigation: NavigationScreenProp<NavigationRoute<{}>, {}>,
) => {
  // Reads in a notification and optionally acts on it.
  console.log('pushNotificationHandler data: ', data);
  switch (data.type) {
    case 'CHOOSE_WINNER_WINNER':
      console.log('CHOOSE_WINNER_WINNER handler');
      // Navigate to MessengerContainer
      navigation.navigate('MessengerContainer', {
        id: data.id,
        matchId: data.matchId,
        otherId: data.otherId,
        name: data.name,
        otherName: data.otherName,
        pic: data.pic,
        otherPic: data.otherPic,
      });
      break;
    case 'CHOOSE_WINNER_LOSER':
      console.log('CHOOSE_WINNER_LOSER handler');
      // Do not navigate anywhere
      break;
    case 'NEW_MESSAGE':
      console.log('NEW_MESSAGE handler');
      // Navigate to MessengerContainer
      navigation.navigate('MessengerContainer', {
        id: data.id,
        matchId: data.matchId,
        otherId: data.otherId,
        name: data.name,
        otherName: data.otherName,
        pic: data.pic,
        otherPic: data.otherPic,
      });
      break;
    case 'CREATE_DATE':
      console.log('CREATE_DATE handler');
      navigation.navigate('BidDate', {
        id, // was id: this.props.id
        date: {
          datetimeOfDate: data.datetimeOfDate,
          description: data.description,
          id: data.dateId,
        },
        otherId: data.id,
        otherName: data.name,
        otherPic: data.profilePic,
      });
      break;
    default:
      console.log('Type not handled: ', data.type);
  }
};
