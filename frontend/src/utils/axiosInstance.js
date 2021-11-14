import axios from 'axios';
import Vue from 'vue';
import { firebase } from '../firestore';

const axiosInstance = axios.create();
axiosInstance.interceptors.request.use(
  async (config) => {
    const googleToken = await firebase.auth().currentUser.getIdToken();
    config.baseURL = Vue.prototype.$API_BASE;
    config.headers = { Authorization: `Bearer ${googleToken}` };
    return config;
  },
  (error) => Promise.reject(error),
);

export { axiosInstance };
