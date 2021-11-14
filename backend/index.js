import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import express from 'express';
import cors from 'cors';
import path from 'path';
// import { firestore } from './firestore.js';
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

import { db, usersCollection } from './mongodb.js';
import toAsyncApp from './asyncApp.js';

import _ from './currentDirectory.cjs';

const { DIRNAME } = _;

if (process.env.FIREBASE_AUTH_EMULATOR_HOST !== undefined) {
  // If we have an env var for the emulator then we should initialize our app with only a projectid
  initializeApp({
    projectId: 'study-group-148',
  });
} else {
  initializeApp({
    // Idea for taking in the config as a base64 string: https://stackoverflow.com/a/61844642
    credential: cert(
      JSON.parse(Buffer.from(process.env.FIREBASE_CONFIG_BASE64, 'base64').toString('ascii')),
    ),
  });
}

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
  if (req.path === AUTH_ENDPOINT || req.path === CLASS_ENDPOINT) {
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
      'ucsb-api-key': 'e7Ur5HGjiyp11ZkCIe5VXmsEgi3W6P4E',
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
        'ucsb-api-key': 'e7Ur5HGjiyp11ZkCIe5VXmsEgi3W6P4E',
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
      'ucsb-api-key': 'e7Ur5HGjiyp11ZkCIe5VXmsEgi3W6P4E',
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
  let userInDb = await usersCollection.findOne({ google_sub: userObj.google_sub });
  if (userInDb === null) {
    await usersCollection.insertOne(userObj);
    userInDb = await usersCollection.findOne({ google_sub: userObj.google_sub });
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
      const id = uuidv4();
      el.roomId = id;
      el.roomName = el.courseID;
      el.users = ['127.0.0.1'];
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

app.get('/api/currentQuarter', async (req, res) => {
  const quarter = await getMostCurrentQuarter();
  res.send({ quarter });
});
// app.get()

app.get('/api/classes_search', async (req, res) => {
  const { course } = req.query;
  console.log(`QUERY CLASS:    ${course}`);

  const quarter = await getMostCurrentQuarter();
  const results = await db.collection(`courses_${quarter}`).find({ $text: { $search: course } }, { score: { $meta: 'textScore' }, courseID: 1, title: 1 }).sort({ score: { $meta: 'textScore' } }).toArray();
  res.send(results.slice(0, 5)); // returns the top 5 most relevant courses
});

app.use('/', express.static(path.join(path.dirname(DIRNAME), '/dist')));
app.get('/*', (req, res) => {
  res.sendFile(path.join(path.dirname(DIRNAME), '/dist/index.html'));
});
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Running on port: ${port}`));

export { app };
