import firebase from 'react-native-firebase';

const db = firebase.firestore();
const auth = firebase.auth();
<<<<<<< HEAD
const crashlytics = firebase.crashlytics();
const analytics = firebase.analytics();
const perf = firebase.perf();

export { firebase, db, crashlytics, analytics, perf, auth };
=======
// const crashlytics = firebase.crashlytics(); // using Sentry instead
const analytics = firebase.analytics();
const perf = firebase.perf();

export { firebase, db, analytics, perf, auth };
>>>>>>> temp2
