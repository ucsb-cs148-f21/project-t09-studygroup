<!--Entire file is cited from https://github.com/Jebasuthan/Vue-Facebook-Google-oAuth-->

<template>
  <div class="main-container">
    <form>
      <div class="box-container">
        <h2 class="heading">
          Sign In
        </h2>
        <SocialLogin />
      </div>
    </form>
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
