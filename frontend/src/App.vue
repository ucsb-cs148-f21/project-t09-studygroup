<template>
  <div>
    <b-navbar
      toggleable="md"
      type="dark"
      variant="dark"
    >
      <b-navbar-brand>UCSB Study Group</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse" />
      <b-collapse
        id="nav-collapse"
        is-nav
      >
        <b-navbar-nav v-if="isLoggedIn">
          <b-nav-item to="/home">
            Home
          </b-nav-item>
          <b-nav-item to="/AdminPanel">
            AdminPanel
          </b-nav-item>

          <b-nav-item-dropdown
            text="My classes"
            right
            :disabled="getClasses.length === 0"
          >
            <li
              v-for="classes in getClasses"
              :key="classes._id"
            >
              <b-dropdown-item :to="`/class/${classes._id}`">
                {{ classes.courseID }}
              </b-dropdown-item>
            </li>
          </b-nav-item-dropdown>
        </b-navbar-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav
          v-if="isLoggedIn"
          class="ms-auto"
        >
          <b-button
            size="sm"
            class="my-2 my-sm-0"
            variant="outline-primary"
            @click="signout"
          >
            Signout
          </b-button>
          <b-nav-item to="/UserProfile">
            <b-img
              :src="`${photoURL}`"
              rounded="circle"
              alt="Circle image"
              height="50"
              width="50"
            />
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <router-view />
  </div>
</template>

<script>
import { firebase } from '@/firestore';
import { axiosInstance } from './utils/axiosInstance';

export default {
  data() {
    return {
      photoURL: '',
      isLoggedIn: false,
      myClasses: [],
      gotClasses: false,
    };
  },
  computed: {
    getClasses() {
      return this.$store.getters.getClasses;
    },
  },
  watch: {
    $route: {
      async handler() {
        const user = firebase.auth().currentUser;
        console.log(user);
        if (user !== null) {
          if (!this.gotClasses) {
            console.log(this.$route)
            const classArray = (await axiosInstance.get('users/getClasses'))
              .data;
            classArray.forEach((el) => {
              this.$store.commit('insertClass', el);
            });
            this.gotClasses = true;
          }
          this.isLoggedIn = true;
          this.photoURL = user.photoURL;
        }
      },
      deep: true,
    },
  },
  methods: {
    signout() {
      firebase.auth().signOut();
      this.$router.go();
    },
  },
};
</script>
