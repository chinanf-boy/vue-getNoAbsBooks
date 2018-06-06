import Vue from "vue";

import localforage from "localforage";

import VueScrollTo from "vue-scrollto";
 
Vue.use(VueScrollTo)

import store from "./store";
import axios from "./http";
import App from "./App.vue";
import router from "./router";
import { Range, Popup, Spinner, Switch, Checklist } from "mint-ui";
import "mint-ui/lib/style.css";

localforage.config({
  name: "getNoAbsBooks"
});

// console.log("main running ");
Vue.component(Checklist.name, Checklist);
Vue.component(Range.name, Range);
Vue.component(Popup.name, Popup);
Vue.component(Spinner.name, Spinner);
Vue.component(Switch.name, Switch);

Vue.config.productionTip = false;

new Vue({
  axios,
  router,
  store,
  render: h => h(App)
}).$mount("#app");
