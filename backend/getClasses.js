import axios from 'axios';

// eslint-disable-next-line import/prefer-default-export
export async function getClasses(quarter) {
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
