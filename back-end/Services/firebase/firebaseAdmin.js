const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); // Path to your service account key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://skipli-demo-9fd14-default-rtdb.firebaseio.com", // Replace with your Firebase database URL
});

const db = admin.database();

module.exports = {
  firebaseAdmin: admin,
  database: db,
};
