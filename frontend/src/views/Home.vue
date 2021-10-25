<template>
  <div id="search-form">
    <b-form @submit="onSubmit" v-if="show">
      <b-form-group
        id="input-group-1"
        label="Course:"
        label-for="input-1"
        description="Enter the course id you are searching for (e.g. CMPSC 148)"
      >
        <b-form-input
          id="input-1"
          v-model="form.course"
          placeholder="Search Course"
          required
        ></b-form-input>
      </b-form-group>
      <b-button id="submit" type="submit" variant="primary">Submit</b-button>
    </b-form>
    <ul id="chat-room-links">
      <li v-for="link in links" :key="link.id">
        <p v-html="link.message"></p>
      </li>
    </ul>
  </div>
</template>

<script>
import db from '../firestore/index.js';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

// @ is an alias to /src
export default {
  data() {
    return {
      form: {
        course: '',
      },
      links: [],
      show: true,
    };
  },
  methods: {
    async onSubmit(event) {
      this.links = [];
      event.preventDefault();
      const userInput = JSON.stringify(this.form);
      const courseName = JSON.parse(userInput).course;

      // search firebase for course
      const q = query(collection(db, 'courses_20214'), where('courseID', '==', courseName));

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        console.log(doc.id, ' => ', doc.data());
        const courseLink = 'http://localhost:8080/class/' + doc.id;
        console.log(courseLink);
        this.links.push({ message: "<a href='" + courseLink + "'>" + courseLink + "</a>" });
      });
      if(querySnapshot.empty){
        this.links.push({ message: "<p>Course Not Found</p>" });
      }
    },
  },
};
</script>

<style scoped>
#search-form {
  height: 100px;
  width: 30%;
  padding-left: 80px;
  padding-top: 40px;
  padding-bottom: 60px;
}
#input-group-1 {
  padding-bottom: 20px;
}
li {
  list-style-type: none;
}
#chat-room-links{
  padding-top: 40px;
  padding-left: 0px;
}
</style>
