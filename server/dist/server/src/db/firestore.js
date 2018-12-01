"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
const serviceAccount = require("../../etc/manhattanmatch-9f9fe-3c40b995f259.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://manhattanmatch-9f9fe.firebaseio.com"
});
const db = admin.firestore();
exports.db = db;
const messaging = admin.messaging();
exports.messaging = messaging;
//# sourceMappingURL=firestore.js.map