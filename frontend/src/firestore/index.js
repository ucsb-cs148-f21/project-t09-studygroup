import app from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/database';
import 'firebase/compat/storage';
import 'firebase/compat/auth';

const config = {

  apiKey: 'AIzaSyDHcoFBHO8mYT_hnT8wjEqQqGtTSuFE9s0',

  authDomain: 'study-group-148.firebaseapp.com',

  projectId: 'study-group-148',

  storageBucket: 'study-group-148.appspot.com',

  messagingSenderId: '732562499999',

  appId: '1:732562499999:web:f262480681942c6fdff5aa',

  measurementId: 'G-T94E5J56CR',

};

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
