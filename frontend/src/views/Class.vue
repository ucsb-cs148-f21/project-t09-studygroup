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
            <b-button :disabled="joinButtonDisabled" @click="putUserInClass">
              Join
            </b-button>
          </b-row>
        </b-card>
      </b-row>
    </div>
    <div v-if="isUserInClass">
      <div class="app-container">
        <div style>
          <div
            style="
              display: inline-block;
              justify-content: center;
              position: relative;
              width: 100%;
            "
          >
            <h3
              style="
                padding-top: 5px;
                width: 30%;
                text-align: center;
                display: block;
                float: left;
                margin-left: 35%;
              "
            >
              {{ courseID }} Chat Rooms
            </h3>
            <b-dropdown
              class="mt-1"
              id="dropdown-right"
              right
              text="Actions"
              style="
                width: 100px;
                display: block;
                float: right;
                padding-left: 5px;
                padding-right: 5px;
              "
            >
              <b-dropdown-item @click="changeDisplayMode">
                {{ displayTheme }}
              </b-dropdown-item>
              <b-dropdown-item @click="showModal"> Quit Class </b-dropdown-item>
            </b-dropdown>
            <b-button
              v-b-toggle.sidebar-1
              shadow-none
              style="float: right"
              class="mt-1"
            >
              Classmates
            </b-button>
          </div>
          <b-sidebar
            id="sidebar-1"
            title="Your Classmates"
            right
            shadow
            width="27rem"
            @hidden="clearUserArray"
            @shown="getStudents($route.params.id)"
          >
            <b-spinner v-if="usersLoading" />
            <div v-if="!usersLoading" class="px-3 py-2">
              <b-list-group-item
                v-for="students in userArray"
                :key="students.uid"
              >
                <b-card :title="students.name">
                  <b-avatar
                    variant="info"
                    :src="students.picture"
                    class="mr-3"
                  />
                  {{ students.email }}
                </b-card>
              </b-list-group-item>
            </div>
          </b-sidebar>
        </div>

        <div>
          <div>
            <b-modal ref="my-modal" ok-title="Yes" @ok="userWantToQuit">
              <div class="d-block text-center">
                <h5>
                  Are you sure you want to quit? If you quit the class, you will
                  also quit all the chat rooms in this class
                </h5>
              </div>
            </b-modal>
          </div>
          <chat-container
            v-if="showChat"
            :key="$route.params.id"
            :is-quit="isQuit"
            :current-user-id="currentUserId"
            :theme="theme"
            :is-device="isDevice"
            @show-demo-options="showDemoOptions = $event"
            @leftRooms="handleLeftChatRooms"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { roomsRef, usersRef, firebase } from "../firestore";
import ChatContainer from "../ChatContainer.vue";
import { axiosInstance } from "../utils/axiosInstance";
import store from "../store/index";

export default {
  components: {
    ChatContainer,
  },

  data() {
    return {
      usersLoading: false,
      theme: "light",
      courseDiscription: "",
      courseID: "",
      displayTheme: "Dark Mode",
      joinButtonDisabled: false,
      isQuit: false,
      showChat: false,
      displayUserlist: false,
      currentUserId: "",
      isDevice: false,
      showDemoOptions: true,
      updatingData: false,
      isUserInClass: false,
      isLoaded: false,
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
    window.addEventListener("resize", (ev) => {
      if (ev.isTrusted) this.isDevice = window.innerWidth < 500;
    });
    await this.initData(this.$route.params.id);
    this.showChat = true;
    this.isLoaded = true;
  },
  methods: {
    handleLeftChatRooms() {
      this.$store.commit("deleteClass", this.$route.params.id);
      this.$router.push({ path: "/home" });
    },
    async initData(classId) {
      console.log(classId);
      this.currentUserId = firebase.auth().currentUser.uid;
      console.log(firebase.auth().currentUser);
      this.classData = (await axiosInstance.get(`class/${classId}`)).data;
      this.isUserInClass = this.classData.students.includes(this.currentUserId);
      this.courseID = this.classData.courseID;
      this.courseDiscription = this.classData.description;
    },

    async getStudents(classId) {
      this.usersLoading = true;
      this.classData = (await axiosInstance.get(`class/${classId}`)).data;
      const uidArray = this.classData.students;
      uidArray.forEach(async (el) => {
        this.userArray.push(
          axiosInstance
            .get(`users/${el}`)
            .then((resp) => resp.data)
            .catch(() => {})
        );
      });
      this.userArray = await Promise.all(this.userArray);
      this.usersLoading = false;
    },
    clearUserArray() {
      this.userArray = [];
    },
    showModal() {
      this.$refs["my-modal"].show();
    },
    hideModal() {
      this.$refs["my-modal"].hide();
    },
    changeDisplayMode() {
      if (this.theme === "light") {
        this.displayTheme = "Light Mode";
        this.theme = "dark";
      } else {
        this.displayTheme = "Dark Mode";
        this.theme = "light";
      }
    },
    async putUserInClass() {
      this.joinButtonDisabled = true;
      await axiosInstance.put(
        `class/${this.$route.params.id}/users`,
        firebase.auth().currentUser.uid
      );
      this.$store.commit("insertClass", this.classData);
      this.isUserInClass = true;
      this.joinButtonDisabled = false;
    },
    async userWantToQuit() {
      this.isQuit = true;
      await axiosInstance.delete(
        `class/${this.$route.params.id}/users`,
        firebase.auth().currentUser.uid
      );
    },
  },
  async beforeRouteUpdate(to, from, next) {
    this.showChat = false;
    this.isLoaded = false;
    await this.initData(to.params.id);
    next();
    this.showChat = true;
    this.isLoaded = true;
  },
};
</script>
