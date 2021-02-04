import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import axios from '@/plugins/http';

import '@/assets/css/common.css';
import 'element-ui/lib/theme-chalk/index.css';

import '@/plugins/element-ui.js';

Vue.config.productionTip = false;
Vue.prototype.$axios = axios;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
