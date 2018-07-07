const functions = require('firebase-functions');

exports.hellowWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

