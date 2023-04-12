import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

import CategoryModule from "./modules/CategoryModule";
import BrandModule from "./modules/BrandModule";
import CouponModule from "./modules/CouponModule";
import ProductsMoudle from "./modules/ProductsMoudle";
import AdsMoudle from "./modules/AdsMoudle";
import UserModule from "./modules/UserModule";
import OrderMoudle from "./modules/OrderMoudle";
import SettingMoudle from "./modules/SettingMoudle";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    server: "http://164.92.249.184:8009",
    snackbar: false,
    textSnackbar: "",
    token: localStorage.getItem("token"),
    full_name: localStorage.getItem("full_name"),
    user_type: localStorage.getItem("user_type"),

    loading_login: false,
    status: "",
    statistics: [],
  },
  getters: {
    // isLoggedIn: (state) => !!state.token,
  },
  mutations: {
    // auth_success(state, token) {
    //   state.token = token;
    //   state.status = "done";
    // },
    // auth_request(state) {
    //   state.status = "loading";
    // },
    auth_error(state) {
      state.status = "error";
    },
    statistics_request(state, statistics) {
      let data = [
        {
          title: "الطلبات المعلقة",
          statistics: statistics.deliverd_orders,
          color: "#FF9800",
          icon: "material-symbols:hourglass-bottom-rounded",
        },
        {
          title: "الطلبات المكتملة",
          statistics: statistics.pending_orders,
          color: "#70e000",
          icon: "pajamas:todo-done",
        },
        {
          title: "المستخدمون",
          statistics: statistics.users,
          color: "#624fc6",
          icon: "mdi:users-group",
        },
        {
          title: "المنتجات",
          statistics: statistics.products,
          color: "#ad519c",
          icon: "material-symbols:shopping-cart-rounded",
        },
      ];

      state.statistics = data;
    },
    LOGIN_USER(state, data) {
      state.user_name = data.result[0].user_name;
      state.phone_number = data.result[0].phone_number;
      state.user_type = data.result[0].user_type;
      state.active = data.result[0].active;
    },
    CLEAR_USER() {
      localStorage.removeItem("token");
      localStorage.removeItem("user_name");
      localStorage.removeItem("user_type");
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("active");

      location.reload();
    },
  },
  actions: {
    async resetFields({ state }) {
      state.token = null;
      state.loading_login = false;
      state.status = "";
      state.user_type = -1;
    },
    snackbarToggle: function ({ state }, data) {
      if (data.toggle == false) {
        state.snackbar = data.toggle;
      } else {
        state.snackbar = data.toggle;
        state.textSnackbar = data.text;
      }
    },
    login({ commit, state }, data) {
      state.loading_login = true;
      return new Promise((resolve, reject) => {
        // commit("auth_request");
        axios({
          url: `${state.server}` + "/api/login",
          data: data,
          method: "POST",
        })
          .then((response) => {
            const token = response.data.token;
            const data = response.data;
            commit("LOGIN_USER", data);
            state.loading_login = false;
            Vue.prototype.$http.defaults.headers.common["Authorization"] =
              "Bearer " + token;
            localStorage.setItem("token", token);
            localStorage.setItem("full_name", data.result[0].user_name);
            localStorage.setItem("user_type", data.result[0].user_type);
            localStorage.setItem("active", data.result[0].active);
            //

            // commit("auth_success", token);
            resolve(response);
          })
          .catch((err) => {
            // commit("auth_error");
            state.loading_login = false;
            localStorage.removeItem("token");

            reject(err);
          });
      });
    },
    logout({ commit }) {
      commit("CLEAR_USER");
    },
    getStatistics({ commit, state }) {
      axios({
        url: `${state.server}` + "/api/statistics",
        method: "GET",
      })
        .then((resp) => {
          console.log(resp);
          commit("statistics_request", resp.data.result);
          resolve(resp);
        })
        .catch((err) => {
          reject(err);
        });
    },
  },
  modules: {
    CategoryModule,
    BrandModule,
    CouponModule,
    ProductsMoudle,
    AdsMoudle,
    UserModule,
    OrderMoudle,
    SettingMoudle,
  },
});
