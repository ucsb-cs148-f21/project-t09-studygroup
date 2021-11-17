<template>
  <!-- <div
    class="fixed-top d-flex align-items-center justify-content-center"
  > -->
  <b-row class="justify-content-center">
    <b-card
      img-src="https://demos.creative-tim.com/argon-dashboard-pro/assets/img/theme/img-1-1000x600.jpg"
      style="max-width: 70rem;"
    >
      <div class="card-img-overlay d-flex align-items-center justify-content-center">
        <b-img
          :src="photoURL"
          rounded="circle"
          alt="Circle image"
          height="200"
          width="200"
        />
      </div>
      <div class="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4 font-weight-regular">
        <h3>
          {{ displayName }}
        </h3>
        <h5>
          <div>{{ email }}</div>
        </h5>
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
