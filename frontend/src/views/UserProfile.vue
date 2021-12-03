<template>
  <b-row class="justify-content-center">
    <b-col cols="6">
      <b-card
        style="max-width: 100rem"
        class="mt-5"
        img-height="500"
        img-width="500"
      >
        <b-row class="justify-content-md-center">
          <b-col md="auto">
            <b-img
              :src="photoURL"
              rounded="circle"
              alt="Circle image"
              height="150"
              width="150"
            />
          </b-col>
        </b-row>
        <b-row class="justify-content-md-center">
          <b-col cols="5" md="auto"> Username: {{ displayName }} </b-col>
        </b-row>
        <b-row class="justify-content-md-center">
          <b-col cols="12" md="auto"> Email: {{ email }} </b-col>
        </b-row>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import { firebase } from "@/firestore";

export default {
  data() {
    return {
      displayName: "",
      email: "",
      // remember to set photoURL to empty string
      photoURL: "",
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
