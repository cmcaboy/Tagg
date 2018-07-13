"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const serviceAccount = require("../../etc/manhattanmatch-9f9fe-3c40b995f259.json");
//admin.initializeApp(functions.config().firebase);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://manhattanmatch-9f9fe.firebaseio.com"
});
const db = admin.firestore();
exports.db = db;
//# sourceMappingURL=firestore.js.map