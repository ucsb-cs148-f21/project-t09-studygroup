<template>
  <div class="tab">
    <a
      v-if="this.$store.state.loginUser"
      href="#"
      class="tablinks"
      @click.prevent="logout"
    >Logout</a>
    <router-link
      to="/login"
      class="tablinks"
    >
      Sign In
    </router-link>
  </div>
</template>

<script>
import router from '../router/index';
import { removeItem } from '../configuration/utils';

export default {
  methods: {
    logout() {
      removeItem('user');
      router.push('/login');
    },
  },
};
</script>
