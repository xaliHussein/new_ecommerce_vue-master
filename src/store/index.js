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
import font from "./modules/font";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    server: "http://164.92.249.184:8009",
    snackbar: false,
    textSnackbar: [],
    snack_message: {},
    token: localStorage.getItem("token"),
    full_name: localStorage.getItem("full_name"),
    user_type: localStorage.getItem("user_type"),
    loading_login: false,
    loading_statistics: false,
    status: "",
    statistics: [],
    chartData: {},
  },

  getters: {
    snackbar(state) {
      return !!state.snackbar;
    },
  },
  mutations: {
    // auth_success(state, token) {
    //   state.token = token;
    //   state.status = "done";
    // },
    // auth_request(state) {
    //   state.status = "loading";
    // },
    SNACK_MESSAGE(state, snack_message) {
      state.snack_message = snack_message;
      state.snackbar = true;
    },
    TIME_OUT(state) {
      state.snackbar = false;
      state.snack_message = null;
    },

    auth_error(state) {
      state.status = "error";
    },
    statistics_request(state, statistics) {
      let object = {};
      let datasets = [];
      let chartData = {};
      let labels = [];
      let pie_data = [];
      statistics.brands.forEach((element) => {
        labels.push(element.name);
        pie_data.push(element.products_count);
      });
      object["backgroundColor"] = [
        "#c89f9c",
        "#219ebc",
        "#fcbf49",
        "#967aa1",
        "#0ead69",
        "#E384FF",
        "#46C2CB",
        "#F5EDCE",
        "#ADDDD0",
        "#47B5FF",
        "#EC255A",
        "#9AE66E",
        "#AD6C80",
        "#EE6F57",
        "#D7385E",
        "#1EAFED",
        "#21ce8f",
      ];
      object["data"] = pie_data;
      datasets.push(object);

      chartData["labels"] = labels;
      chartData["datasets"] = datasets;
      let data = [
        {
          title: "الطلبات المعلقة",
          statistics: statistics.pending_orders,
          color: "#FF9800",
          icon: "material-symbols:hourglass-bottom-rounded",
        },
        {
          title: "الاقسام",
          statistics: 6,
          color: "#70e000",
          icon: "material-symbols:format-list-bulleted",
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
      state.chartData = chartData;
    },
    LOGIN_USER(state, data) {
      state.user_name = data.result[0].user_name;
      state.phone_number = data.result[0].phone_number;
      state.user_type = data.result[0].user_type;
      state.active = data.result[0].active;
    },
    CLEAR_USER() {
      localStorage.removeItem("token");
      localStorage.removeItem("full_name");
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

    login({ commit, state }, data) {
      state.loading_login = true;
      return new Promise((resolve, reject) => {
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

            resolve(response);
          })
          .catch((err) => {
            state.loading_login = false;
            localStorage.removeItem("token");
            let snack_message = {};
            snack_message["color"] = "#B71C1C";
            snack_message["icon"] = "ri:close-circle-fill";
            snack_message["text"] = err.response.data.message;
            this.commit("SNACK_MESSAGE", snack_message);
            setTimeout(() => {
              this.commit("TIME_OUT", snack_message);
            }, 4000);

            reject(err);
          });
      });
    },
    logout({ commit }) {
      commit("CLEAR_USER");
    },
    getStatistics({ commit, state }) {
      state.loading_statistics = true;
      return new Promise((resolve) => {
        axios({
          url: `${state.server}` + "/api/statistics",
          method: "GET",
        })
          .then((resp) => {
            state.loading_statistics = false;
            commit("statistics_request", resp.data.result);
            resolve(resp);
          })
          .catch(() => {
            state.loading_statistics = false;
            let snack_message = {};
            snack_message["color"] = "#B71C1C";
            snack_message["icon"] = "ri:close-circle-fill";
            snack_message["text"] = "حدث مشكلة في الاتصال بالخادم";
            this.commit("SNACK_MESSAGE", snack_message);
            setTimeout(() => {
              this.commit("TIME_OUT", snack_message);
            }, 4000);
          });
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
    font,
  },
});
