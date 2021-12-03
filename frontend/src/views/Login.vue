<!--Some of file is cited from https://github.com/Jebasuthan/Vue-Facebook-Google-oAuth-->

<template>
  <div>
    <b-container>
      <b-col class="justify-content-center">
        <b-row class="justify-content-center">
          <b-jumbotron
            header="Welcome to UCSB study group 😊!"
            header-level="3"
            lead="Designed for better study experience"
          >
            <p>
              In our UCSB study group website, you can look for study partners
              in the class you enrolled in.
            </p>
            <p>Please sign in with UCSB account.</p>
            <form>
              <div class="box-container">
                <SocialLogin />
              </div>
            </form>
          </b-jumbotron>
        </b-row>
      </b-col>
    </b-container>
  </div>
</template>

<script>
import SocialLogin from '../components/SocialLogin.vue';

export default {
  name: 'Login',
  components: {
    SocialLogin,
  },
};
</script>
