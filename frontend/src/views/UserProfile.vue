<template>
  <!-- <div
    class="fixed-top d-flex align-items-center justify-content-center"
  > -->
  <b-row class="justify-content-center">
    <b-card
      img-src="https://images.unsplash.com/photo-1487088678257-3a541e6e3922?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2274&q=80"
      style="max-width: 100rem;"
      img-height="500"
      img-width="500"
    >
      <div class="card-img-overlay d-flex align-items-center justify-content-center">
        <b-img
          :src="photoURL"
          rounded="circle"
          alt="Circle image"
          height="150"
          width="150"
        />
      </div>
      <div class="text-center border-10 pt-8 pt-md-4 pb-0 pb-md-4 font-weight-regular justify-content-center">
        <b-row class="justify-content-md-center">
          <b-col cols="12" md="auto">Username: {{displayName}}</b-col>
        </b-row>
        <b-row class="justify-content-md-center">
          <b-col cols="12" md="auto">Email: {{email}}</b-col>
        </b-row>
      </div>
    </b-card>
  </b-row>
  <!-- </div> -->
  <!-- </div> -->
</template>

<script>
import { firebase } from '@/firestore';

export default {
  data() {
    return {
      displayName: '',
      email: '',
      // remember to set photoURL to empty string
      photoURL: '',
    };
  },
  mounted() {
    const user = firebase.auth().currentUser;
    if (user !== null) {
      // The user object has basic properties such as display name, email, etc.
      this.displayName = user.displayName;
      this.email = user.email;
      this.photoURL = user.photoURL;
    }
  },
};
</script>
