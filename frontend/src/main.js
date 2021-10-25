import Vue from 'vue';
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';
import App from './App.vue';
import router from './router/index';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

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
