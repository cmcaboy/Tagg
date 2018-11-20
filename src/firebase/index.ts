import firebase from 'react-native-firebase';

const db = firebase.firestore();
const auth = firebase.auth();
// const crashlytics = firebase.crashlytics(); // using Sentry instead
const analytics = firebase.analytics();
const perf = firebase.perf();

export {
  firebase, db, analytics, perf, auth,
};
