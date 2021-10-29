import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import axios from 'axios';
import express from 'express';
import cors from 'cors';

import serveStatic from 'serve-static';
import path from 'path';
import { db } from './firestore.js';
import _ from './currentDirectory.cjs';

const {__dirname} = _;

const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

// build multiple CRUD interfaces:
// TODO: 1. get the most current quarter using another axios request
// 2. use the quarter in the getclass function
// 3. go through that data and take out few things that we want
// 4. courseID, course instructor, etc.
// 5. put each in its own json documents
// 6. learn how to store that into firebase
// 7. make the Vue admin button to send request to this add-recent-classes

app.post('/api/add-recent-classes', async (req, res) => {
  const quarter = await getMostCurrentQuarter();
  if ((await db.collection(`courses_${quarter}`).limit(1).get()).size !== 1) {
    (await getClasses(quarter)).forEach(async (el) => {
      const id = uuidv4();
      el.roomId = id;
      el.roomName = el.courseID;
      el.users = ['127.0.0.1'];
      await db.collection(`courses_${quarter}`).doc(id).set(el);
    });
  }
  res.sendStatus(200);
});
app.get('/api/currentQuarter', async (req, res) => {
  const quarter = await getMostCurrentQuarter();
  res.send({ quarter });
});
// app.get()

app.use('/',express.static(path.join(path.dirname(__dirname), '/dist')));
app.get('/*', (req, res) => {
  res.sendFile(path.join(path.dirname(__dirname), '/dist/index.html'));
})
console.log(path.dirname(''))
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Running on port: ${port}`));

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

export {app};
