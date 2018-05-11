import Vue from "vue";
import axios from './http'
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

new Vue({
  axios,
  router,
  store,
  render: h => h(App)
}).$mount("#app");
