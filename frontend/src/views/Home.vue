<template>
<div v-if = "this.$store.state.loginUser.loginType = 'google' ">
            <div class="center">
              <p>Welcome {{this.$store.state.loginUser.google.user.name}} !</p>
              <!-- <p>Email Address: {{this.$store.state.loginUser.google.user.email}} !</p> -->
              <img :src="this.$store.state.loginUser.google.user.profileImage" />
              <p><b>Google Access Token- </b>{{this.$store.state.loginUser.google.auth.access_token}}</p>
            </div>
  <div id="search-form">
    <b-form
      v-if="show"
      @submit="onSubmit"
    >
      <b-form-group
        id="input-group-1"
        label="Course:"
        label-for="input-1"
        description="Enter the course id you are searching for (e.g. ANTH 3). The id is case-sensitive."
      >
        <b-form-input
          id="input-1"
          v-model="form.course"
          placeholder="Search Course"
          required
        />
      </b-form-group>
      <b-button
        id="submit"
        type="submit"
        variant="primary"
      >
        Submit
      </b-button>
    </b-form>
    <ul id="chat-room-links">
      <li
        v-for="link in links"
        :key="link.id"
      >
        <p v-html="link.message" />
      </li>
    </ul>
  </div>
  </div>
</template>

<script>
import {
  getFirestore, collection, query, where, getDocs,
} from 'firebase/firestore';
import HomeMenu from '../components/Menu.vue';
import { db } from '../firestore/index.js';

// @ is an alias to /src
export default {
  name: 'home',
  components: {
    HomeMenu,
  },
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
        const courseLink = `${window.location.origin}/class/${doc.id}`;
        console.log(courseLink);
        this.links.push({ message: `<a href='${courseLink}'>${courseLink}</a>` });
      });
      if (querySnapshot.empty) {
        this.links.push({ message: '<p>Course Not Found</p>' });
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
