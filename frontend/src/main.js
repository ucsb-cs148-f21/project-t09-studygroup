import Vue from 'vue';
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';
import App from './App.vue';
import router from './router/index';
import store from './store/index';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import GoogleAuth from './configuration/google_oAuth.js';

const gauthOption = {
  clientId: '186644924647-bl8ti02k5mondecje2l6065kb179qhml.apps.googleusercontent.com',
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
  render: (h) => h(App),
}).$mount('#app');
