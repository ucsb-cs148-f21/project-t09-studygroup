<template>
  <div>
    <!--Carousel code copied and adapted from here https://bootstrap-vue.org/docs/components/carousel-->
    <b-row class="justify-content-md-center">
      <b-col cols="10">
        <b-carousel
          id="carousel-1"
          v-model="slide"
          :interval="4000"
          controls
          fade
          background="#ababab"

          style="text-shadow: 1px 1px 2px #333"
          @sliding-start="onSlideStart"
          @sliding-end="onSlideEnd"
        >
          <b-carousel-slide caption="Welcome to UCSB study group 😊!">
            <template #img>
              <img
                class="d-block img-fluid w-100"
                alt="image slot"

                src="@/assets/lagoon.jpg"
              >
            </template>
          </b-carousel-slide>

          <b-carousel-slide
            caption="In our UCSB study group website, you can look for study partners
              in the class you enrolled in."
          >
            <template #img>
              <img
                class="d-block img-fluid w-100"
                alt="image slot"

                src="@/assets/sea.jpg"
              >
            </template>
          </b-carousel-slide>

          <b-carousel-slide
            caption="Hope you have a wonderful study experience 🤩!"
          >
            <template #img>
              <img
                class="d-block img-fluid w-100"
                alt="image slot"

                src="@/assets/night.jpg"
              >
            </template>
          </b-carousel-slide>
        </b-carousel>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="10">
        <div id="search-form">
          <b-form
            v-if="show"
            @submit="onSubmit"
          >
            <b-form-group
              id="input-group-1"
              label-for="input-1"
              description="Enter the course id or related terms (e.g. ANTH 3)."
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
              :key="link._id"
            >
              <router-link :to="`/class/${link._id}`">
                {{ link.courseID }}
              </router-link>
              <p>
                {{ link.description }}
              </p>
            </li>
          </ul>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
// import axios from 'axios';
import { axiosInstance } from '../utils/axiosInstance';
// @ is an alias to /src
export default {
  name: 'Home',
  components: {},
  data() {
    return {
      form: {
        course: '',
      },
      titlemessage: 'coursename: ',
      links: [],
      show: true,
      slide: 0,
      sliding: null,
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
    },
    onSlideStart() {
      this.sliding = true;
    },
    onSlideEnd() {
      this.sliding = false;
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
