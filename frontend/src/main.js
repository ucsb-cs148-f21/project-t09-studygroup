import Vue from 'vue';
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';
import App from './App.vue';
import router from './router/index';
import store from './store/index';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import GoogleAuth from './configuration/google_oAuth';

const gauthOption = {
  clientId: process.env.VUE_APP_CLIENT_ID,
  scope: 'profile email',
  prompt: 'select_account',
};
Vue.use(GoogleAuth, gauthOption);
Vue.config.productionTip = true;

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);

Vue.config.productionTip = false;
if (window.location.hostname === 'localhost') {
  Vue.prototype.$API_BASE = 'http://localhost:3000/api/';
} else {
  Vue.prototype.$API_BASE = `${window.location.origin}/api/`;
}

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
