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
          <b-nav-item to="AdminPanel">
            AdminPanel
          </b-nav-item>
          <b-nav-item to="About">
            About
          </b-nav-item>
        </b-navbar-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav
          v-if="isLoggedIn"
          class="ms-auto"
        >
          <b-nav-item to="UserProfile">
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

export default {
  data() {
    return {
      photoURL: '',
      isLoggedIn: false,
    };
  },
  watch: {
    $route: {
      handler() {
        const user = firebase.auth().currentUser;
        console.log(user);
        if (user !== null) {
          this.isLoggedIn = true;
          this.photoURL = user.photoURL;
        }
      },
      deep: true,
    },
  },
  beforeRouteUpdate() {
    const user = firebase.auth().currentUser;
    console.log(user);
    if (user !== null) {
      this.isLoggedIn = true;
      this.photoURL = user.photoURL;
    }
  },
  mounted() {
    const user = firebase.auth().currentUser;
    if (user !== null) {
      this.isLoggedIn = true;
      this.photoURL = user.photoURL;
    }
  },
};
</script>
