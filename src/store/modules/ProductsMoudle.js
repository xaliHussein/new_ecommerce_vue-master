import Vue from "vue";
import axios from "axios";

const ProductsMoudle = {
  namespaced: true,
  state: () => ({
    products: [],
    product_state: "done",
    table_loading: false,
    table_delete_loading: false,
    loading_add_product: false,
    pop_loading: false,
    productQuery: "",
    pageCount: 1,
    selected_object: {},
    isEdit: false,
    params: {
      dropdown: true,
      sortBy: [],
      sortDesc: [],
      page: 1,
      itemsPerPage: 10,
    },
  }),
  mutations: {
    product_success(state, products) {
      state.products.splice(0, state.products.length);
      products.forEach((element) => {
        state.products.push(element);
      });
      state.product_state = "done";
      state.table_loading = false;
    },
    product_request(state) {
      state.product_state = "loading";
    },

    product_error(state) {
      state.product_state = "error";
    },
    product_edit_success(state, product) {
      let index = state.products.findIndex((e) => e.id == product.id);
      Vue.set(state.products, index, product);
      state.product_state = "done";
      state.table_loading = false;
    },
    add_product_success(state, product) {
      state.products.unshift(product);
      state.product_state = "done";
      state.table_loading = false;
    },
    delete_product(state, product) {
      let index = state.products.findIndex((e) => e.id == product.id);
      state.products.splice(index, 1);
      state.product_state = "done";
      state.table_loading = false;
    },
    delete_advance_details(state, product) {
      let index = state.products.findIndex((e) => e.id == product.id);
      Vue.set(state.products, index, product);
      state.product_state = "done";
      state.table_loading = false;
    },
    delete_image(state, product) {
      let index = state.products.findIndex((e) => e.id == product.id);
      Vue.set(state.products, index, product);
    },
  },
  actions: {
    async resetFields({ state }) {
      state.product_state = "done";
      state.products = [];
      state.pageCount = 1;
      state.table_loading = false;
      state.params = {
        sortBy: [],
        sortDesc: [],
        page: 1,
        itemsPerPage: 10,
      };
    },
    async getProducts({ commit, state, dispatch, rootState }) {
      if (state.product_state != "done") return -1;
      state.table_loading = true;
      let data = state.params;
      state.table_loading = true;
      return new Promise((resolve, reject) => {
        let skip = (data.page - 1) * data.itemsPerPage;
        let limit = data.itemsPerPage;
        let query = "";
        let sort = "";
        if (data.sortBy.length > 0)
          sort = `&${data.sortBy[0]}=${data.sortDesc}`;
        if (
          state.productQuery != undefined &&
          state.productQuery != null &&
          state.productQuery.length > 0
        )
          query = `&query=${state.productQuery}`;

        axios({
          url:
            `${rootState.server}` +
            "/api/get_products" +
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
            commit("product_success", resp.data.result);
            resolve(resp);
          })
          .catch(() => {
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

    async addProduct({ commit, state, dispatch, rootState }, data) {
      state.table_loading = true;
      state.loading_add_product = true;
      return new Promise((resolve) => {
        commit("product_request");
        axios({
          url: `${rootState.server}` + "/api/add_product",
          data: data,
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        })
          .then((resp) => {
            commit("add_product_success", resp.data.result[0]);
            let snack_message = {};
            snack_message["color"] = "#00C853";
            snack_message["icon"] = "clarity:success-standard-solid";
            snack_message["text"] = resp.data.message;
            commit("SNACK_MESSAGE", snack_message, { root: true });
            setTimeout(() => {
              commit("TIME_OUT", snack_message, { root: true });
            }, 4000);
            state.table_loading = false;
            state.loading_add_product = false;
            resolve(resp);
          })
          .catch((err) => {
            state.table_loading = false;
            state.loading_add_product = false;
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
    async editProduct({ commit, state, dispatch, rootState }, data) {
      state.pop_loading = true;
      return new Promise((resolve) => {
        commit("product_request");
        axios({
          url: `${rootState.server}` + "/api/update_product",
          data: data,
          headers: {
            "Content-Type": "application/json",
          },
          method: "PUT",
        })
          .then((resp) => {
            state.pop_loading = false;
            commit("product_edit_success", resp.data.result[0]);
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
            state.pop_loading = false;
            commit("product_error");
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
    async deleteProduct({ commit, state, dispatch, rootState }, data) {
      state.pop_loading = true;
      return new Promise((resolve) => {
        commit("product_request");
        axios({
          url: `${rootState.server}` + "/api/delete_product",
          data: { id: data.id },
          headers: {
            "Content-Type": "application/json",
          },
          method: "delete",
        })
          .then((resp) => {
            state.pop_loading = false;

            commit("delete_product", data);
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
            state.pop_loading = false;
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
    async deleteAdvanceDetails({ commit, state, dispatch, rootState }, data) {
      state.table_delete_loading = true;
      return new Promise((resolve) => {
        commit("product_request");

        axios({
          url: `${rootState.server}` + "/api/delete_advance_details",
          data: data,

          headers: {
            "Content-Type": "application/json",
          },
          method: "PUT",
        })
          .then((resp) => {
            state.table_delete_loading = false;
            commit("delete_advance_details", resp.data.result[0]);
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
            state.table_delete_loading = false;

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
    async deleteImage({ commit, state, dispatch, rootState }, data) {
      state.table_loading = true;

      return new Promise((resolve) => {
        axios({
          url: `${rootState.server}` + "/api/delete_image",
          data: data,
          headers: {
            "Content-Type": "application/json",
          },
          method: "delete",
        })
          .then((resp) => {
            state.table_loading = false;

            commit("delete_image", resp.data.result[0]);
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
export default ProductsMoudle;
