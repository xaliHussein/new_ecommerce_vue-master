import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./plugins/UploadImage";
import "./plugins/filter";
import "./plugins/iconify";
import "./plugins/moment";
import "./plugins/print";
import "./plugins/vueLazyload";

import vuetify from "./plugins/vuetify";
import Axios from "axios";
import LottieAnimation from "lottie-vuejs/src/LottieAnimation.vue"; // import lottie-vuejs

Vue.use(LottieAnimation); // add lottie-animation to your global scope

Vue.use(require("vue-moment"));

Vue.config.productionTip = false;
Vue.prototype.$http = Axios;
const token = localStorage.getItem("token");
if (token) {
  Vue.prototype.$http.defaults.headers.common["Authorization"] =
    "Bearer " + token;
}
Axios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data

    if (response.data.result != undefined && response.data.code != 200) {
      return Promise.reject(response.data.errors);
    }
    return response;
  },
  function (error) {
    // console.log(error.response.status);
    //error.response.status

    if (error.response.status == 402) {
      localStorage.removeItem("token");
      localStorage.removeItem("user_type");
      localStorage.removeItem("user_name");
      store.state.token = null;

      router.replace("/login");
    }
    let message = error.response.data.message;
    Object.keys(error.response.data.errors).forEach((element) => {
      message = message + "\n" + error.response.data.errors[element][0];
    });
    error.response.data.message = message;
    return Promise.reject(error);
  }
);
new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
