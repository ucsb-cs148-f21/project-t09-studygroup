import Vue from 'vue';
import Vuex from 'vuex';
import store from './store/index';
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';
import App from './App.vue';
import router from './router/index';
import { firebase } from './firestore/index';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.config.productionTip = false;


Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);

Vue.config.productionTip = false;
if (window.location.hostname === 'localhost') {
  Vue.prototype.$API_BASE = 'http://localhost:3000/api/';
} else {
  Vue.prototype.$API_BASE = `${window.location.origin}/api/`;
}

const unsubscribe = firebase.auth().onAuthStateChanged(() => {
  new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount('#app');
  unsubscribe();
});
