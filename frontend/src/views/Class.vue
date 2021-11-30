<!-- Some of this code copied from demo folder here: https://github.com/antoine92190/vue-advanced-chat-->
<template>
  <div v-if="isLoaded">
    <div v-if="!isUserInClass">
      <b-row class="justify-content-center">
        <b-card
          img-src="https://images.unsplash.com/photo-1613089566490-ec5b9a7d4a60?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzF8fHdlbGNvbWV8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60"
          img-alt="Image"
          img-top
          style="max-width: 20rem"
          :title="courseID"
        >
          <b-card-text>
            {{ courseDiscription }}
          </b-card-text>
          <b-row class="justify-content-center">
            <b-button @click="putUserInClass">
              Join
            </b-button>
          </b-row>
        </b-card>
      </b-row>
    </div>
    <div v-if="isUserInClass">
      <div
        class="app-container"
        :class="{ 'app-mobile': isDevice, 'app-mobile-dark': theme === 'dark' }"
      >
        <!-- <div>
                <button @click="resetData">Clear Data</button>
                <button @click="addData" :disabled="updatingData">Add Data</button>
            </div> -->

        <div>
          <b-row class="justify-content-center">
            <h3 class="text-center">
              {{ courseID }}
            </h3>
            <p class="text-center w-75"> {{ courseDiscription }} </p>
            <b-button v-b-toggle.sidebar-1>
              See who's in the class
            </b-button>
          </b-row>
          <b-sidebar
            id="sidebar-1"
            title="Your companions"
            right
            shadow
          >
            <div class="px-3 py-2">
              <li
                v-for="students in userArray"
                :key="students.uid"
              >
                <b-card
                  href="#"
                  :title="students.name"
                >
                  <b-avatar
                    variant="info"
                    :src="students.picture"
                    class="mr-3"
                  />
                  {{ students.email }}
                </b-card>
              </li>
            </div>
          </b-sidebar>
        </div>
        <div>
          <b-button
            id="show-btn"
            variant="outline-danger"
            squared
            @click="showModal"
          >
            Quit Class
          </b-button>
          <b-modal
            ref="my-modal"
            hide-footer
            title="Are you sure you want to quit?"
          >
            <div class="d-block text-center">
              <h5>If you quit the class, you will also quit the chat room</h5>
            </div>
            <b-button
              class="mt-3"
              variant="outline-danger"
              block
              @click="userWantToQuit"
            >
              Yes, quit
            </b-button>
            <br>
            <b-button
              class="mt-3"
              variant="outline-warning"
              block
              @click="hideModal"
            >
              No, don't quit
            </b-button>
          </b-modal>
        </div>
        <chat-container
          v-if="showChat"
          :current-user-id="currentUserId"
          :theme="theme"
          :is-device="isDevice"
          @show-demo-options="showDemoOptions = $event"
        />

        <!-- <div class="version-container">
                v1.0.0
            </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import { roomsRef, usersRef, firebase } from '../firestore';
import ChatContainer from '../ChatContainer.vue';
import { axiosInstance } from '../utils/axiosInstance';
import store from '../store/index';

export default {
  components: {
    ChatContainer,
  },

  data() {
    return {
      theme: 'light',
      courseDiscription: '',
      courseID: '',
      showChat: false,
      displayUserlist: false,
      currentUserId: '',
      isDevice: false,
      showDemoOptions: true,
      updatingData: false,
      isUserInClass: false,
      isLoaded: false,
      wantQuit: false,
      classData: {},
      userArray: [],
    };
  },

  computed: {
    showOptions() {
      return !this.isDevice || this.showDemoOptions;
    },
  },
  async mounted() {
    this.isDevice = window.innerWidth < 500;
    window.addEventListener('resize', (ev) => {
      if (ev.isTrusted) this.isDevice = window.innerWidth < 500;
    });
    this.currentUserId = firebase.auth().currentUser.uid;
    console.log(firebase.auth().currentUser);
    this.classData = (
      await axiosInstance.get(`class/${this.$route.params.id}`)
    ).data;
    this.isUserInClass = this.classData.students.includes(this.currentUserId);
    this.courseID = this.classData.courseID;
    this.courseDiscription = this.classData.description;

    const uidArray = this.classData.students;
    uidArray.forEach(async (el) => {
      this.userArray.push((await axiosInstance.get(`users/${el}`)).data);
    });

    this.showChat = true;
    this.isLoaded = true;
  },
  methods: {
    showModal() {
      this.$refs['my-modal'].show();
    },
    hideModal() {
      this.$refs['my-modal'].hide();
    },
    async putUserInClass() {
      await axiosInstance.put(
        `class/${this.$route.params.id}/users`,
        firebase.auth().currentUser.uid,
      );
      this.$store.commit('insertClass', this.classData);
      this.isUserInClass = true;
    },
    async userWantToQuit() {
      this.wantQuit = true;
      await axiosInstance.delete(`class/${this.$route.params.id}/users`,firebase.auth().currentUser.uid,);
      this.isUserInClass = false;
    },
  },
  /* watch: {
    currentUserId() {
      this.showChat = false;
      setTimeout(() => (this.showChat = true), 150);
    },
  }, */
  async beforeRouteUpdate(to, from, next) {
    this.classData = (await axiosInstance.get(`class/${to.id}`)).data;
    this.isUserInClass = this.classData.students.includes(this.currentUserId);

    const uidArray = this.classData.students;
    uidArray.forEach(async (el) => {
      this.userArray.push((await axiosInstance.get(`users/${el}`)).data);
    });
  },
};
</script>
