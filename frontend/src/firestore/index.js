// Much of this code copied from demo folder here: https://github.com/antoine92190/vue-advanced-chat
import app from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/database';
import 'firebase/compat/storage';
import 'firebase/compat/auth';

const config = JSON.parse(process.env.VUE_APP_FIREBASE_CONFIG);

app.initializeApp(config);

export const db = app.firestore();

export const firebase = app;
if (window.location.hostname === 'localhost') {
  db.useEmulator('localhost', 2020);
  const auth = firebase.auth();
  auth.useEmulator('http://localhost:9099');
}

export const storageRef = app.storage().ref();

export const usersRef = db.collection('users');
export const roomsRef = db.collection('chatRooms');
export const messagesRef = (roomId) => roomsRef.doc(roomId).collection('messages');

export const filesRef = storageRef.child('files');

export const dbTimestamp = firebase.firestore.FieldValue.serverTimestamp();
export const deleteDbField = firebase.firestore.FieldValue.delete();
