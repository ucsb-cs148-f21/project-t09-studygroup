<template>
  <div>
    <div id="search-form">
      <b-form v-if="show" @submit="onSubmit" class="justify-content-center">
        <b-form-group
          id="input-group-1"
          label-for="input-1"
          description="Enter the course id or related terms you are searching for (e.g. ANTH 3)."
        >
          <b-form-input
            id="input-1"
            v-model="form.course"
            placeholder="Search Course"
            required
          />
        </b-form-group>
        <b-button id="submit" type="submit" variant="primary">
          Submit
        </b-button>
      </b-form>
      <ul id="chat-room-links">
        <li v-for="link in links" :key="link._id">
          <router-link :to="`/class/${link._id}`">
            {{ link.courseID }}
          </router-link>
          <p>
            {{ link.description }}
          </p>
          <!-- <p v-html="link.message" /> -->
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
// import axios from 'axios';
import { axiosInstance } from "../utils/axiosInstance";
// @ is an alias to /src
export default {
  name: "Home",
  components: {},
  data() {
    return {
      form: {
        course: "",
      },
      titlemessage: "coursename: ",
      links: [],
      show: true,
    };
  },
  methods: {
    async onSubmit(event) {
      this.links = [];
      event.preventDefault();
      const userInput = JSON.stringify(this.form);
      const cname = JSON.parse(userInput).course;

      this.links = (
        await axiosInstance.get(`classes_search?course=${cname}`)
      ).data.results;
      // const str = JSON.stringify(this.links, null, 2);
      // console.log(str);
      console.log(this.links);
      // const courseLink = `${window.location.origin}/class/${this.info._id}`;
      // async onSubmit(event) {
      //   this.links = [];
      //   event.preventDefault();
      //   const searchText = this.course;

      //   // search firebase for course
      //   const q = query(collection(db, 'courses_20214'), where('courseID', '==', courseName));

      //   const querySnapshot = await getDocs(q);
      //   querySnapshot.forEach((doc) => {
      //     console.log(doc.id, ' => ', doc.data());
      //     const courseLink = `${window.location.origin}/class/${doc._id}`;
      //     console.log(courseLink);
      //     this.links.push({ message: `<a href='${courseLink}'>${courseLink}</a>` });
      //   });
      //   if (querySnapshot.empty) {
      //     this.links.push({ message: '<p>Course Not Found</p>' });
      //   }
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
#chat-room-links {
  padding-top: 40px;
  padding-left: 0px;
}
</style>
