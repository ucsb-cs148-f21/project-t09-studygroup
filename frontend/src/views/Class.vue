<template />

<script>
import { axiosInstance } from '../utils/axiosInstance';

export default {
  data() { return { classData: {} }; },
  async beforeRouteUpdate(to, from, next) {
    this.classData = (await axiosInstance.get(`class/${to.id}`)).data;
  },
  async mounted() {
    this.classData = (await axiosInstance.get(`class/${this.$route.params.id}`)).data;
  },
};
</script>
