<!-- Much of this code copied from demo folder here: https://github.com/antoine92190/vue-advanced-chat-->
<template>
  <div>
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
        <button
          class="button-light"
          @click="theme = 'light'"
        >
          Light
        </button>
        <button
          class="button-dark"
          @click="theme = 'dark'"
        >
          Dark
        </button>
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
</template>

<script>
import { roomsRef, usersRef, firebase } from '../firestore';
import ChatContainer from '../ChatContainer.vue';
import { axiosInstance } from '../utils/axiosInstance';

export default {
  components: {
    ChatContainer,
  },

  data() {
    return {
      theme: 'light',
      showChat: false,
      currentUserId: '',
      isDevice: false,
      showDemoOptions: true,
      updatingData: false,
      classData: {},
    };
  },

  computed: {
    showOptions() {
      return !this.isDevice || this.showDemoOptions;
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
  },
  async mounted() {
    this.isDevice = window.innerWidth < 500;
    window.addEventListener('resize', (ev) => {
      if (ev.isTrusted) this.isDevice = window.innerWidth < 500;
    });

    this.currentUserId = firebase.auth().currentUser.uid;
    console.log(firebase.auth().currentUser);
    this.classData = (await axiosInstance.get(`class/${this.$route.params.id}`)).data;
    this.showChat = true;
  },
};
</script>
