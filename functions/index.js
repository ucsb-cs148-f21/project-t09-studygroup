const functions = require("firebase-functions");
const axios = require("axios").default;
const express = require("express");
const cors = require("cors");

const app = express();

const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();


// Automatically allow cross-origin requests
app.use(cors({origin: true}));


// build multiple CRUD interfaces:
// TODO: 1. get the most current quarter using another axios request
// 2. use the quarter in the getclass function
// 3. go through that data and take out few things that we want
// 4. courseID, course instructor, etc.
// 5. put each in its own json documents
// 6. learn how to store that into firebase
// 7. make the Vue admin button to send request to this add-recent-classes

app.post("/add-recent-classes", async (req, res) => {
  let quarter = await getMostCurrentQuarter();
  if ((await db.collection(`courses_${quarter}`).limit(1).get()).size !== 1){
  (await getClasses(quarter)).forEach(async (el)=>{
    await db.collection(`courses_${quarter}`).add(el);
    
  });
}
  res.sendStatus(200);
});
// app.get()

// Expose Express API as a single Cloud Function:
exports.widgets = functions.https.onRequest(app);

async function getMostCurrentQuarter() {

  const qinfo = await axios.get("https://api.ucsb.edu/academics/quartercalendar/v1/quarters/current", {

    headers: {
      "accept": "application/json",
      "ucsb-api-version": "1.0",
      "ucsb-api-key": "e7Ur5HGjiyp11ZkCIe5VXmsEgi3W6P4E",
    },
  }); 

  return qinfo.data.quarter;
}

async function getClasses(quarter) {
  

  let classesinfo = await axios.get(`https://api.ucsb.edu/academics/curriculums/v1/classes/search?quarter=${quarter}&pageNumber=1&pageSize=20&includeClassSections=true`, {

    headers: {
      "accept": "application/json",
      "ucsb-api-version": "1.0",
      "ucsb-api-key": "e7Ur5HGjiyp11ZkCIe5VXmsEgi3W6P4E",
    },
  });
  classesinfo = classesinfo.data;
  const courseInfo = classesinfo.classes.map(function(item) {
    const instructorList = [];

    item.classSections.forEach(function getInstructor(element) {
      element.instructors.forEach(function getList(ele){
        if (ele.functionCode === "Teaching and in charge") {
          instructorList.push(ele.instructor);
        }
      });
      // if (element.instructors.functionCode === "Teaching and in charge") {
      //   instructorList.push(element.instructors.instructor);

      // }
    });
    let courseID = item.courseId;
    courseID = courseID.replace(/\s+/g, " ").trim();
    const title = item.title;
    const description = item.description;

    return {
      courseID,
      title,
      "instructors": instructorList,
      description};
  });
  return courseInfo;
}


