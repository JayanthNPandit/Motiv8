const admin = require("firebase-admin");
require("dotenv").config();

const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${process.env.PROJECT_ID}.firebaseio.com`,
  storageBucket: `${process.env.PROJECT_ID}.appspot.com`,
});

const db = admin.firestore();
const bucket = admin.storage();

module.exports = { db, bucket };