import firebase from 'react-native-firebase';

const db = firebase.firestore();
const crashlytics = firebase.crashlytics();
const analytics = firebase.analytics();
const perf = firebase.perf();

export { firebase, db, crashlytics, analytics, perf };
