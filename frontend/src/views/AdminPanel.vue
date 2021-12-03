<template>
  <div class="adminpanel">
    <h1>Admin Panel</h1>
    <p>
      For now, if the database is empty, this button will populate it only with
      classes from winter quarter 2021.
    </p>
    <b-button
      block
      variant="primary"
      :disabled="isLoading"
      @click="getClasses()"
    >
      <b-spinner v-if="isLoading" style="width: 1rem; height: 1rem" />
      Refresh Quarter
    </b-button>
  </div>
</template>
<script>
// import axios from 'axios';
import { axiosInstance } from "../utils/axiosInstance";

export default {
  data() {
    return {
      isLoading: false,
    };
  },
  methods: {
    async getClasses() {
      console.log(this.$API_BASE);
      this.isLoading = true;
      await axiosInstance.post(`${this.$API_BASE}add-recent-classes`);
      this.isLoading = false;
    },
  },
};
</script>
