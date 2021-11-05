import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import express from 'express';
import cors from 'cors';
import path from 'path';
// import { firestore } from './firestore.js';
import { OAuth2Client } from 'google-auth-library';

import { db, usersCollection } from './mongodb.js';

import _ from './currentDirectory.cjs';

const { DIRNAME } = _;
const app = express();

// allow cross-origin requests for development
if (process.env.NODE_ENV !== 'production') {
  app.use(cors({ origin: 'http://localhost:8080' }));
}

const login = express();
// build multiple CRUD interfaces:
// TODO: 1. get the most current quarter using another axios request
// 2. use the quarter in the getclass function
// 3. go through that data and take out few things that we want
// 4. courseID, course instructor, etc.
// 5. put each in its own json documents
// 6. learn how to store that into firebase
// 7. make the Vue admin button to send request to this add-recent-classes

async function verify(client, token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.VUE_APP_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const userObj = { name: payload.name, google_email: payload.email, google_sub: payload.sub };
  return userObj;
  // If request specified a G Suite domain:
  // const domain = payload['hd'];
}

async function getClasses(quarter) {
  let classesinfo = await axios.get(`https://api.ucsb.edu/academics/curriculums/v1/classes/search?quarter=${quarter}&pageNumber=1&pageSize=20&includeClassSections=true`, {

    headers: {
      accept: 'application/json',
      'ucsb-api-version': '1.0',
      'ucsb-api-key': 'e7Ur5HGjiyp11ZkCIe5VXmsEgi3W6P4E',
    },
  });
  classesinfo = classesinfo.data;
  const courseInfo = classesinfo.classes.map((item) => {
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
  return courseInfo;
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

login.post('/api/auth', async (req, res) => {
  const client = new OAuth2Client(process.env.VUE_APP_CLIENT_ID);
  let userObj;
  try {
    userObj = verify(client, res.oauthToken);
  } catch (error) {
    res.status(401).send({ error: 'bad_oauth_token' });
    return;
  }
  // find if sub exists
  const len = userObj[1].length();
  if (userObj.google_email.substr(len - 9, len - 1) === 'ucsb.edu') {
    if (usersCollection.findOne({ google_sub: userObj.google_sub }) === null) {
      await db.collection('users').insertOne(userObj);
    } else {
      // Return JWT
    }
  } else {
    res.status(403).send({ error: 'non_ucsb_email' });
    return;
  }
  res.sendStatus(200);
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
  res.sendStatus(200);
});

app.get('/api/currentQuarter', async (req, res) => {
  const quarter = await getMostCurrentQuarter();
  res.send({ quarter });
});
// app.get()

app.use('/', express.static(path.join(path.dirname(DIRNAME), '/dist')));
app.get('/*', (req, res) => {
  res.sendFile(path.join(path.dirname(DIRNAME), '/dist/index.html'));
});
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Running on port: ${port}`));

export { app };
