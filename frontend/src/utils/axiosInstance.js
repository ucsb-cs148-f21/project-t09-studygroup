import axios from 'axios';
import Vue from 'vue';

const axiosInstance = axios.create();
axiosInstance.interceptors.request.use(
  async (config) => {
    const JWT = localStorage.getItem('JWT_token');
    config.baseURL = Vue.prototype.$API_BASE;
    config.headers = { Authorization: `Bearer ${JWT}` };
    return config;
  },
  (error) => Promise.reject(error),
);

export { axiosInstance };
