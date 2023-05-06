import Vue from "vue";
import axios from "axios";

const CouponModule = {
  namespaced: true,
  state: () => ({
    coupons: [],
    coupon_state: "done",
    table_loading: false,
    loading_add_coupon: false,
    pop_loading: false,
    couponQuery: "",
    pageCount: 1,
    selected_object: {},

    params: {
      dropdown: true,
      sortBy: [],
      sortDesc: [],
      page: 1,
      itemsPerPage: 10,
    },
  }),
  mutations: {
    coupon_success(state, coupons) {
      state.coupons.splice(0, state.coupons.length);
      coupons.forEach((element) => {
        state.coupons.push(element);
      });
      state.coupon_state = "done";
      state.table_loading = false;
    },
    coupon_request(state) {
      state.coupon_state = "loading";
    },

    coupon_error(state) {
      state.coupon_state = "error";
    },
    coupon_edit_success(state, coupon) {
      let index = state.coupons.findIndex((e) => e.id == coupon.id);
      Vue.set(state.coupons, index, coupon);
      state.coupon_state = "done";
      state.table_loading = false;
    },
    add_coupon_success(state, coupon) {
      if (coupon.parent_id == null) {
        state.coupons.unshift(coupon);
        state.coupon_state = "done";
        state.table_loading = false;
      }
    },
    delete_coupon(state, coupon) {
      let index = state.coupons.findIndex((e) => e.id == coupon.id);
      state.coupons.splice(index, 1);
      state.coupon_state = "done";
      state.table_loading = false;
    },
  },
  actions: {
    async resetFields({ state }) {
      state.coupon_state = "done";
      state.coupons = [];
      state.pageCount = 1;
      state.table_loading = false;
      state.params = {
        sortBy: [],
        sortDesc: [],
        page: 1,
        itemsPerPage: 10,
      };
    },
    async getCoupons({ commit, state, dispatch, rootState }) {
      if (state.coupon_state != "done") return -1;
      state.table_loading = true;
      let data = state.params;
      return new Promise((resolve, reject) => {
        let skip = (data.page - 1) * data.itemsPerPage;
        let limit = data.itemsPerPage;
        let query = "";
        let sort = "";
        if (data.sortBy.length > 0)
          sort = `&${data.sortBy[0]}=${data.sortDesc}`;
        if (
          state.couponQuery != undefined &&
          state.couponQuery != null &&
          state.couponQuery.length > 0
        )
          query = `&query=${state.couponQuery}`;
        axios({
          url:
            `${rootState.server}` +
            "/api/get_coupons" +
            "?skip=" +
            skip +
            "&limit=" +
            limit +
            sort +
            query,
          method: "GET",
        })
          .then((resp) => {
            state.table_loading = false;
            state.pageCount = resp.data.count;
            commit("coupon_success", resp.data.result);
            resolve(resp);
          })
          .catch(() => {
            let snack_message = {};
            snack_message["color"] = "#ef4444";
            snack_message["icon"] = "ri:close-circle-fill";
            snack_message["text"] = "حدث مشكلة في الاتصال بالخادم";
            commit("SNACK_MESSAGE", snack_message, { root: true });
            setTimeout(() => {
              commit("TIME_OUT", snack_message, { root: true });
            }, 4000);
          });
      });
    },

    async addCoupon({ commit, state, dispatch, rootState }, data) {
      state.table_loading = true;
      state.loading_add_coupon = true;
      return new Promise((resolve) => {
        axios({
          url: `${rootState.server}` + "/api/add_coupon",
          data: data,
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        })
          .then((resp) => {
            state.table_loading = false;
            state.loading_add_coupon = false;
            commit("add_coupon_success", resp.data.result[0]);
            let snack_message = {};
            snack_message["color"] = "#21ce8f";
            snack_message["icon"] = "clarity:success-standard-solid";
            snack_message["text"] = resp.data.message;
            commit("SNACK_MESSAGE", snack_message, { root: true });
            setTimeout(() => {
              commit("TIME_OUT", snack_message, { root: true });
            }, 4000);
            resolve(resp);
          })
          .catch((err) => {
            state.table_loading = false;
            state.loading_add_coupon = false;
            let snack_message = {};
            snack_message["color"] = "#ef4444";
            snack_message["icon"] = "ri:close-circle-fill";
            snack_message["text"] = err.response.data.message;
            commit("SNACK_MESSAGE", snack_message, { root: true });
            setTimeout(() => {
              commit("TIME_OUT", snack_message, { root: true });
            }, 4000);
          });
      });
    },
    async editCoupon({ commit, state, dispatch, rootState }, data) {
      state.pop_loading = true;
      console.log(data);
      return new Promise((resolve) => {
        commit("coupon_request");
        axios({
          url: `${rootState.server}` + "/api/update_coupon",
          data: data,
          headers: {
            "Content-Type": "application/json",
          },
          method: "PUT",
        })
          .then((resp) => {
            console.log(resp);
            state.pop_loading = false;
            commit("coupon_edit_success", resp.data.result[0]);
            let snack_message = {};
            snack_message["color"] = "#21ce8f";
            snack_message["icon"] = "clarity:success-standard-solid";
            snack_message["text"] = resp.data.message;
            commit("SNACK_MESSAGE", snack_message, { root: true });
            setTimeout(() => {
              commit("TIME_OUT", snack_message, { root: true });
            }, 4000);
            resolve(resp);
          })
          .catch((err) => {
            state.pop_loading = false;
            let snack_message = {};
            snack_message["color"] = "#ef4444";
            snack_message["icon"] = "ri:close-circle-fill";
            snack_message["text"] = err.response.data.message;
            commit("SNACK_MESSAGE", snack_message, { root: true });
            setTimeout(() => {
              commit("TIME_OUT", snack_message, { root: true });
            }, 4000);
          });
      });
    },
    async deleteCoupon({ commit, state, dispatch, rootState }, data) {
      state.pop_loading = true;
      return new Promise((resolve) => {
        commit("coupon_request");
        axios({
          url: `${rootState.server}` + "/api/delete_coupon",
          data: { id: data.id },
          headers: {
            "Content-Type": "application/json",
          },
          method: "delete",
        })
          .then((resp) => {
            state.pop_loading = false;
            commit("delete_coupon", data);
            let snack_message = {};
            snack_message["color"] = "#21ce8f";
            snack_message["icon"] = "clarity:success-standard-solid";
            snack_message["text"] = resp.data.message;
            commit("SNACK_MESSAGE", snack_message, { root: true });
            setTimeout(() => {
              commit("TIME_OUT", snack_message, { root: true });
            }, 4000);
            resolve(resp);
          })
          .catch((err) => {
            state.pop_loading = false;
            let snack_message = {};
            snack_message["color"] = "#ef4444";
            snack_message["icon"] = "ri:close-circle-fill";
            snack_message["text"] = err.response.data.message;
            commit("SNACK_MESSAGE", snack_message, { root: true });
            setTimeout(() => {
              commit("TIME_OUT", snack_message, { root: true });
            }, 4000);
          });
      });
    },
  },
};
export default CouponModule;
