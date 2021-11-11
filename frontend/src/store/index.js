import Vue from 'vue';
import Vuex from 'vuex';
import { setStore, getStore } from '../configuration/utils';

Vue.use(Vuex);

// Adapted from https://github.com/Jebasuthan/Vue-Facebook-Google-oAuth
const user = getStore('user');
const JWTtoken = localStorage.getItem('JWT_token');

export default new Vuex.Store({
  state: {
    loginUser: user,
    JWT: JWTtoken,
  },
  mutations: {
    setLoginUser(state, userArg) {
      state.loginUser = userArg;
      setStore('user', userArg);
    },
    setJWT(state, JWT) {
      state.JWT = JWT;
      setStore('JWT_token', JWT);
    },
  },
  actions: {

  },
  getters: {
    isLoggedIn(state) {
      return !!state.token;
    },
    getLoginUserInfo(state) {
      return state.loginUser;
    },
    getJWT(state) {
      return state.JWT;
    },
  },
});
