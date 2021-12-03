import { v4 as uuidv4 } from 'uuid';
import express from 'express';
import cors from 'cors';
import path from 'path';
// import { firestore } from './firestore.js';
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

import { ObjectId } from 'mongodb';
import { db, usersCollection } from './mongodb.js';
import toAsyncApp from './asyncApp.js';

import _ from './currentDirectory.cjs';
import { getMostCurrentQuarter } from './getMostCurrentQuarter';
import { getClasses } from './getClasses';

const { DIRNAME } = _;

if (process.env.FIREBASE_AUTH_EMULATOR_HOST !== undefined) {
  // If we have an env var for the emulator then we should initialize our app with only a projectid
  initializeApp({
    projectId: 'study-group-148',
  });
} else {
  initializeApp({
    credential: cert(
      JSON.parse(process.env.FIREBASE_CONFIG),
    ),
  });
}
const app = toAsyncApp(express());

// allow cross-origin requests for development
if (process.env.NODE_ENV !== 'production') {
  app.use(cors({ origin: 'http://localhost:8080' }));
}

const AUTH_ENDPOINT = '/api/auth';

app.use(express.json());

async function verify(token) {
  const decodedToken = await getAuth().verifyIdToken(token);
  return decodedToken;
}

// This will ensure that the user is authorized for all endpoints except for the authentication endpoint
app.use(async (req, res, next) => {
  if (req.path === AUTH_ENDPOINT || req.path.substr(0, 4) !== '/api') {
    next();
    return;
  }
  try {
    const LEN_OF_BEARER = 'Bearer '.length;
    const decodedToken = await verify(req.header('Authorization').substr(LEN_OF_BEARER));
    req.user = decodedToken;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).send({ error: 'could_not_authenticate_token' });
  }
});

async function getClassByOid(Oid) {
  const quarter = await getMostCurrentQuarter();
  console.log(new ObjectId(Oid));
  return db.collection(`courses_${quarter}`).findOne({ _id: ObjectId(Oid) });
}

async function replaceClassByOid(Oid, obj) {
  const quarter = await getMostCurrentQuarter();
  console.log(new ObjectId(Oid));
  await db.collection(`courses_${quarter}`).replaceOne({ _id: ObjectId(Oid) }, obj);
}

app.post(AUTH_ENDPOINT, async (req, res) => {
  let userObj;
  try {
    userObj = await verify(req.body.oauthToken);
  } catch (error) {
    console.log(error);
    res.status(401).send({ error: 'bad_oauth_token' });
    return;
  }
  const userInDb = await usersCollection.findOne({ uid: userObj.uid });
  if (userInDb === null) {
    await usersCollection.insertOne(userObj);
    res.status(200).send({ message: 'created_user' });
    return;
  }
  res.status(200).send({ message: 'user_already_exists' });
});

app.post('/api/add-recent-classes', async (req, res) => {
  const quarter = await getMostCurrentQuarter();

  // Check collection exists before re writing over classes
  if ((await db.collection(`courses_${quarter}`).findOne({})) === null) {
    (await getClasses(quarter)).forEach(async (el) => {
      el.students = [];
      await db.collection(`courses_${quarter}`).insertOne(el);
    });
  }
  // db.collection(`courses_${quarter}`).deleteMany({});
  // (await getClasses(quarter)).forEach(async (el) => {
  //   const id = uuidv4();
  //   el.roomId = id;
  //   el.roomName = el.courseID;
  //   el.users = ['127.0.0.1'];
  //   await db.collection(`courses_${quarter}`).insertOne(el);
  // });
  res.status(200).send();
});

app.get('/api/class/:classID', async (req, res) => {
  const classObj = await getClassByOid(req.params.classID);
  if (classObj !== null) { return res.send(classObj); }
  return res.sendStatus(404);
});

app.put('/api/class/:classID/users', async (req, res) => {
  const decodedToken = req.user;
  const classObj = await getClassByOid(req.params.classID);
  const userUID = decodedToken.uid;
  if (classObj === null) { return res.sendStatus(404); }
  classObj.students.push(userUID);
  await replaceClassByOid(req.params.classID, classObj);
  const user = await db.collection('users').findOne({ uid: userUID });
  if (user.classes === undefined) {
    user.classes = [];
  }
  user.classes.push(req.params.classID);
  await db.collection('users').replaceOne({ uid: userUID }, user);
  return res.send(200);
});

app.delete('/api/class/:classID/users', async (req, res) => {
  const decodedToken = req.user;
  const classObj = await getClassByOid(req.params.classID);
  const userUID = decodedToken.uid;
  const user = await db.collection('users').findOne({ uid: userUID });
  if (classObj === null) { return res.sendStatus(404); }
  if (user === null) { return res.sendStatus(404); }
  classObj.students = classObj.students.filter((element) => element !== decodedToken.uid);
  await replaceClassByOid(req.params.classID, classObj);
  user.classes = user.classes.filter((element) => element !== req.params.classID);
  await db.collection('users').replaceOne({ uid: userUID }, user);
  return res.send(200);
});

app.get('/api/currentQuarter', async (req, res) => {
  const quarter = await getMostCurrentQuarter();
  res.send({ quarter });
});
// app.get()

app.get('/api/classes_search', async (req, res) => {
  const { course } = req.query;
  console.log(`QUERY CLASS:    ${course}`);
  const quarter = await getMostCurrentQuarter();
  const results = await db.collection(`courses_${quarter}`).find({ $text: { $search: course } },
    { score: { $meta: 'textScore' }, courseID: 1, title: 1 }).sort({ score: { $meta: 'textScore' } }).toArray();
  res.send({ results: results.slice(0, 5) }); // returns the top 5 most relevant courses
});

app.get('/api/class/:classID/user_search', async (req, res) => {
  const { searchText } = req.query;
  const classObj = await getClassByOid(req.params.classID);
  const results = await db.collection('users').find({ uid: { $in: classObj.students, $ne: req.user.uid }, $text: { $search: searchText } }, { score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } }).toArray();
  res.send({ results: results.slice(0, 10) }); // returns the top 5 most relevant courses
});




app.get('/api/users/getClasses', async (req, res) => {
  const decodedToken = req.user;
  const userUID = decodedToken.uid;
  const user = await db.collection('users').findOne({ uid: userUID });
  const classObj = [];
  if (user.classes === undefined) {
    res.send([]);
    return;
  }
  // console.log(user.classes.size);
  for (let i = 0; i < user.classes.length; i += 1) {
    classObj.push(await getClassByOid(user.classes[i]));
    console.log(classObj);
  }
  res.send(classObj);
});

app.get('/api/users/:userUID', async (req, res) => {
  const { userUID } = req.params;

  const user = await db.collection('users').findOne({ uid: userUID });
  if (user === null) return res.sendStatus(404);
  return res.send(user);
});

app.use('/', express.static(path.join(path.dirname(DIRNAME), '/dist')));
app.get('/*', (req, res) => {
  res.sendFile(path.join(path.dirname(DIRNAME), '/dist/index.html'));
});
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Running on port: ${port}`));

export { app };
