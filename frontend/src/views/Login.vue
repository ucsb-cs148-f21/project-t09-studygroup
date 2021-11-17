<!--Entire file is cited from https://github.com/Jebasuthan/Vue-Facebook-Google-oAuth-->

<template>
  <div
    class="fixed-top d-flex align-items-center justify-content-center"
    style="bottom: 0; overflow-y: auto"
  >
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
