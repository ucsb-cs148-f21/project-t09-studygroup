import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    myclasses: [],
  },
  mutations: {
    insertClass(state, newclass) {
      state.myclasses.push(newclass);
    },
  },
  getters: {
    getClasses(state) {
      return state.myclasses;
    },
  },
});
