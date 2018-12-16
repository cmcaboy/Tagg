const admin = require('firebase-admin');

const serviceAccount = require('../../etc/manhattanmatch-9f9fe-3c40b995f259.json');

// admin.initializeApp(functions.config().firebase);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://manhattanmatch-9f9fe.firebaseio.com',
});

const settings = { timestampsInSnapshots: true };

const db = admin.firestore();
db.settings(settings);

const messaging = admin.messaging();

export { db, messaging };
