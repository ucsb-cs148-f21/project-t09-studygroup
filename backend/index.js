import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import express from 'express';
import cors from 'cors';
import path from 'path';
// import { firestore } from './firestore.js';
import { initializeApp, cert } from 'firebase-admin/app';
import { FieldValue, getFirestore, Timestamp } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

import { ObjectId } from 'mongodb';
import { db, usersCollection } from './mongodb.js';
import toAsyncApp from './asyncApp.js';

import _ from './currentDirectory.cjs';
import { validateChatRoomBody } from './validations.js';

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

const firestore = getFirestore();
const app = toAsyncApp(express());

// allow cross-origin requests for development
if (process.env.NODE_ENV !== 'production') {
  app.use(cors({ origin: 'http://localhost:8080' }));
}

const AUTH_ENDPOINT = '/api/auth';
const CLASS_ENDPOINT = '/api/classes_search';

app.use(express.json());

async function verify(token) {
  const decodedToken = await getAuth().verifyIdToken(token);
  return decodedToken;
}

// This will ensure that the user is authorized for all endpoints except for the authentication endpoint
app.use(async (req, res, next) => {
  if (req.path === AUTH_ENDPOINT || req.path.substr(0, 3) !== 'api') {
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

// const login = express();
// build multiple CRUD interfaces:
// TODO: 1. get the most current quarter using another axios request
// 2. use the quarter in the getclass function
// 3. go through that data and take out few things that we want
// 4. courseID, course instructor, etc.
// 5. put each in its own json documents
// 6. learn how to store that into firebase
// 7. make the Vue admin button to send request to this add-recent-classes

async function getClasses(quarter) {
  const pageSize = 300;
  let listOfClasses = [];
  let classesinfo = await axios.get(`https://api.ucsb.edu/academics/curriculums/v1/classes/search?quarter=${quarter}&pageNumber=1&pageSize=${pageSize}&includeClassSections=true`, {

    headers: {
      accept: 'application/json',
      'ucsb-api-version': '1.0',
      'ucsb-api-key': process.env.UCSB_API_KEY,
    },
  });
  const totalNumber = classesinfo.data.total;
  const totalCourses = parseInt(totalNumber, 10);
  let page = 1;
  classesinfo = classesinfo.data;
  let courseInfo = classesinfo.classes.map((item) => {
    const instructorList = [];

    item.classSections.forEach((element) => {
      element.instructors.forEach((ele) => {
        if (ele.functionCode === 'Teaching and in charge') {
          instructorList.push(ele.instructor);
        }
      });
      // if (element.instructors.functionCode === "Teaching and in charge") {
      //   instructorList.push(element.instructors.instructor);

      // }
    });
    let courseID = item.courseId;
    courseID = courseID.replace(/\s+/g, ' ').trim();
    const { title } = item;
    const { description } = item;

    return {
      courseID,
      title,
      instructors: instructorList,
      description,
    };
  });
  listOfClasses = listOfClasses.concat(courseInfo);
  while (pageSize * page < totalCourses) {
    page += 1;
    // eslint-disable-next-line no-await-in-loop
    classesinfo = await axios.get(`https://api.ucsb.edu/academics/curriculums/v1/classes/search?quarter=${quarter}&pageNumber=${page}&pageSize=${pageSize}&includeClassSections=true`, {

      headers: {
        accept: 'application/json',
        'ucsb-api-version': '1.0',
        'ucsb-api-key': process.env.UCSB_API_KEY,
      },
    });
    classesinfo = classesinfo.data;
    courseInfo = classesinfo.classes.map((item) => {
      const instructorList = [];
      item.classSections.forEach((element) => {
        element.instructors.forEach((ele) => {
          if (ele.functionCode === 'Teaching and in charge') {
            instructorList.push(ele.instructor);
          }
        });
        // if (element.instructors.functionCode === "Teaching and in charge") {
        //   instructorList.push(element.instructors.instructor);
        // }
      });
      let courseID = item.courseId;
      courseID = courseID.replace(/\s+/g, ' ').trim();
      const { title } = item;
      const { description } = item;

      return {
        courseID,
        title,
        instructors: instructorList,
        description,
      };
    });
    listOfClasses = listOfClasses.concat(courseInfo);
  }
  return listOfClasses;
}
export async function getMostCurrentQuarter() {
  const qinfo = await axios.get('https://api.ucsb.edu/academics/quartercalendar/v1/quarters/current', {

    headers: {
      accept: 'application/json',
      'ucsb-api-version': '1.0',
      'ucsb-api-key': process.env.UCSB_API_KEY,
    },
  });

  return qinfo.data.quarter;
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
  const quarter = await getMostCurrentQuarter();
  const classObj = await db.collection(`courses_${quarter}`).findOne({ _id: ObjectId(req.params.classID) });
  if (classObj !== null) { return res.send(classObj); }
  return res.sendStatus(404);
});

app.put('/api/class/:classID/users', async (req, res) => {
  const decodedToken = req.user;
  const quarter = await getMostCurrentQuarter();
  const classObj = await db.collection(`courses_${quarter}`).findOne({ _id: ObjectId(req.params.classID) });
  if (classObj === null) { return res.sendStatus(404); }
  classObj.students.push(decodedToken.uid);
  await db.collection(`courses_${quarter}`).replaceOne({ _id: ObjectId(req.params.classID) }, classObj);
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
  res.send(results.slice(0, 5)); // returns the top 5 most relevant courses
});

app.get('/api/class/:classID/user_search', async (req, res) => {
  const { searchText } = req.query;
  const quarter = await getMostCurrentQuarter();
  const classObj = await db.collection(`courses_${quarter}`).findOne({ _id: ObjectId(req.params.classID) });
  const results = await db.collection('users').find({ uid: { $in: classObj.students, $ne: req.user.uid }, $text: { $search: searchText } }, { score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } }).toArray();
  res.send({ results: results.slice(0, 10) }); // returns the top 5 most relevant courses
});

async function getClassByOid(Oid) {
  const quarter = await getMostCurrentQuarter();
  console.log(new ObjectId(Oid));
  return db.collection(`courses_${quarter}`).findOne({ _id: ObjectId(Oid) });
}

/* app.post('/api/class/:classId/chat_rooms', async (req, res) => {
  if (validateChatRoomBody(req) === false) return res.sendStatus(422);
  const { classId } = req.params;
  const classObj = await getClassByOid(classId);
  if (classObj === null) return res.status(404).send({ error: 'class_not_found' });

  const isUserListValid = req.body.users.every((userId) => classObj.students.includes(userId));

  if (isUserListValid === false) return res.status(409).send({ error: 'user_not_in_class' });
  const ref = await firestore.doc(`chatRooms/${uuidv4()}`);
  await ref.update({
    classId,
    lastUpdated: FieldValue.serverTimestamp(),
    users: req.body.users,
  });
  res.sendStatus(200);
}); */

app.use('/', express.static(path.join(path.dirname(DIRNAME), '/dist')));
app.get('/*', (req, res) => {
  res.sendFile(path.join(path.dirname(DIRNAME), '/dist/index.html'));
});
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Running on port: ${port}`));

export { app };
