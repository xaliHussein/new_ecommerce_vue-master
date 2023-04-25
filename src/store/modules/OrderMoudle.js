import Vue from "vue";
import axios from "axios";

const OrderMoudle = {
  namespaced: true,
  state: () => ({
    orders: [],
    order_state: "done",
    table_loading: false,
    orderQuery: "",
    pageCount: 1,
    params: {
      sortBy: [],
      sortDesc: [],
      page: 1,
      itemsPerPage: 10,
    },
  }),
  mutations: {
    order_success(state, orders) {
      console.log(orders);
      state.orders.splice(0, state.orders.length);
      orders.forEach((element) => {
        state.orders.push(element);
      });
      state.order_state = "done";
      state.table_loading = false;
    },
    order_request(state) {
      state.order_state = "loading";
    },

    order_error(state) {
      state.order_state = "error";
    },
    order_status_change_success(state, order) {
      let index = state.orders.findIndex((e) => e.id == order.id);
      Vue.set(state.orders, index, order);
      state.order_state = "done";
      state.table_loading = false;
    },
    // get_products_order_success(state, products) {

    // }
  },
  actions: {
    async resetFields({ state }) {
      state.order_state = "done";
      // state.orders = [];
      state.ads_products = [];
      state.pageCount = 1;
      state.table_loading = false;
      state.params = {
        sortBy: [],
        sortDesc: [],
        page: 1,
        itemsPerPage: 10,
      };
    },
    async getOrders({ commit, state, dispatch, rootState }) {
      if (state.order_state != "done") return -1;
      state.table_loading = true;
      let data = state.params;
      // let ads_id = id ? id : null
      // console.log("here", ads_id)
      state.table_loading = true;
      return new Promise((resolve, reject) => {
        let skip = (data.page - 1) * data.itemsPerPage;
        let limit = data.itemsPerPage;
        let query = "";
        if (
          state.orderQuery != undefined &&
          state.orderQuery != null &&
          state.orderQuery.length > 0
        )
          query = `&query=${state.orderQuery}`;

        axios({
          url:
            `${rootState.server}` +
            "/api/get_all_orders" +
            "?skip=" +
            skip +
            "&limit=" +
            limit +
            query,
          method: "GET",
        })
          .then((resp) => {
            state.table_loading = false;
            state.pageCount = resp.data.count;
            commit("order_success", resp.data.result);
            resolve(resp);
          })
          .catch(() => {
            let snack_message = {};
            snack_message["color"] = "#B71C1C";
            snack_message["icon"] = "ri:close-circle-fill";
            snack_message["text"] = "حدث مشكلة في الاتصال بالخادم";
            commit("SNACK_MESSAGE", snack_message, { root: true });
            setTimeout(() => {
              commit("TIME_OUT", snack_message, { root: true });
            }, 4000);
          });
      });
    },

    // async getProductsOrder({ commit, state, dispatch, rootState }, data) {
    //     state.table_loading = true
    //     return new Promise((resolve) => {
    //         commit("order_request");
    //         axios({
    //             url: `${rootState.server}` + "/api/get_products_order?order_id=" + data,
    //             method: "GET",
    //         }).then(resp => {
    //             state.table_loading = false;
    //             state.pageCount = resp.data.count;
    //             commit('get_products_order_success', resp.data.result)
    //             dispatch("snackbarToggle", { toggle: true, text: resp.data.message }, { root: true });
    //             resolve(resp);
    //         })
    //     });
    // },

    async changeOrderStatus({ commit, state, dispatch, rootState }, data) {
      state.table_loading = true;
      console.log(data);
      return new Promise((resolve) => {
        commit("order_request");
        axios({
          url: `${rootState.server}` + "/api/change_status_order",
          data: data,
          headers: {
            "Content-Type": "application/json",
          },
          method: "PUT",
        })
          .then((resp) => {
            state.table_loading = false;
            commit("order_status_change_success", resp.data.result[0]);
            let snack_message = {};
            snack_message["color"] = "#00C853";
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
            let snack_message = {};
            snack_message["color"] = "#B71C1C";
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
export default OrderMoudle;
