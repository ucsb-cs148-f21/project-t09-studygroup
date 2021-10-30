<template>
  <div class="adminpanel">
    <h1>Admin Panel</h1>
    <b-button
      block
      variant="primary"
      @click="getClasses()"
    >
      Refresh Quarter
    </b-button>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  methods: {
    getClasses() {
      console.log(this.$API_BASE);
      axios.post(`${this.$API_BASE}add-recent-classes`);
    },
  },

};
</script>
