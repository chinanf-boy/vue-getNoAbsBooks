import Vue from "vue";
import Router from "vue-router";
import Meta from 'vue-meta'

import Home from "./views/Home.vue";
import About from "./views/About.vue";

import BookIndex from "./views/Index.vue";

Vue.use(Router);
Vue.use(Meta)

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/about",
      name: "about",
      component: About
    },
    {
      path: "*",
      name: "BookIndex",
      component: BookIndex
    }
  ]
});
