/*
 * @Author: shuang.yu
 * @Date: 2020-12-04 17:03:27
 */
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import "./assets/common.css";

import ElementUI from "element-ui";
import "./theme/index.css";

Vue.use(ElementUI);

import preview from "vue-photo-preview";
import "vue-photo-preview/dist/skin.css";

Vue.use(preview);

Vue.http = Vue.prototype.$http = axios;
Vue.http.defaults.baseURL = process.env.VUE_APP_BASE_URL;
Vue.http.defaults.timeout = 10000;
Vue.pageUrl = process.env.VUE_APP_PAGE_URL;
Vue.PageSize = 50;

Vue.config.productionTip = false;

// 页面跳转前判断登录状态
import { getCookie } from "./utils/http";
// router.beforeEach((to, from, next) => {
//   if (to.name == "login") {
//     next();
//   } else {
//     let session = getCookie("session");
//     console.log(session);
//     if (session.length <= 0) {
//       // localStorage.removeItem('permissions')
//       next("/login");
//     } else {
//       next();
//     }
//   }
// });

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
