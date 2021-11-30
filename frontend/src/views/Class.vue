<!-- Some of this code copied from demo folder here: https://github.com/antoine92190/vue-advanced-chat-->
<template>
  <div v-if="isLoaded">
    <div v-if="!isUserInClass">
      <b-row class="justify-content-center">
        <b-card
          img-src="https://images.unsplash.com/photo-1613089566490-ec5b9a7d4a60?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzF8fHdlbGNvbWV8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60"
          img-alt="Image"
          img-top
          style="max-width: 20rem;"
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

        <div
          v-if="showOptions"
          class="button-theme"
        >
          <b-button
            class="button-light"
            @click="theme = 'light'"
          >
            Light
          </b-button>
          <b-button
            class="button-dark"
            @click="theme = 'dark'"
          >
            Dark
          </b-button>
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
      currentUserId: '',
      isDevice: false,
      showDemoOptions: true,
      updatingData: false,
      isUserInClass: false,
      isLoaded: false,
      classData: {},
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
    this.classData = (await axiosInstance.get(`class/${this.$route.params.id}`)).data;
    this.isUserInClass = this.classData.students.includes(this.currentUserId);
    this.courseID = this.classData.courseID;
    this.courseDiscription = this.classData.description;
    this.showChat = true;
    this.isLoaded = true;
  },
  methods: {
    async putUserInClass() {
      await axiosInstance.put((`class/${this.$route.params.id}/users`), firebase.auth().currentUser.uid);
      this.$store.commit('insertClass', this.classData);
      this.isUserInClass = true;
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
  },
};
</script>
