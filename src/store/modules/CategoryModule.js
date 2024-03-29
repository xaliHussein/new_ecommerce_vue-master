import Vue from "vue";
import axios from "axios";

const CategoryModule = {
  namespaced: true,
  state: () => ({
    categories: [],
    category_state: "done",
    table_loading: false,
    pop_loading: false,
    loading_add_Category: false,
    categoryQuery: "",
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
    category_success(state, categories) {
      state.categories.splice(0, state.categories.length);
      categories.forEach((element) => {
        state.categories.push(element);
      });
      state.category_state = "done";
      state.table_loading = false;
    },
    category_request(state) {
      state.category_state = "loading";
    },

    category_error(state) {
      state.category_state = "error";
    },
    category_edit_success(state, category) {
      console.log(category);
      let index = state.categories.findIndex((e) => e.id == category.id);
      Vue.set(state.categories, index, category);
      state.category_state = "done";
      state.table_loading = false;
    },
    add_category_success(state, category) {
      if (category.parent_id == null) {
        state.categories.unshift(category);
        state.category_state = "done";
        state.table_loading = false;
      }
    },
    delete_category(state, category) {
      let index = state.categories.findIndex((e) => e.id == category.id);
      state.categories.splice(index, 1);
      state.category_state = "done";
      state.table_loading = false;
    },
  },
  actions: {
    async resetFields({ state }) {
      state.category_state = "done";
      state.categories = [];
      state.pageCount = 1;
      state.table_loading = false;
      state.params = {
        sortBy: [],
        sortDesc: [],
        page: 1,
        itemsPerPage: 10,
      };
    },
    async getCategories({ commit, state, dispatch, rootState }) {
      if (state.category_state != "done") return -1;
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
          state.categoryQuery != undefined &&
          state.categoryQuery != null &&
          state.categoryQuery.length > 0
        )
          query = `&query=${state.categoryQuery}`;

        axios({
          url:
            `${rootState.server}` +
            "/api/get_categories" +
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
            commit("category_success", resp.data.result);
            resolve(resp);
          })
          .catch((err) => {
            state.table_loading = false;
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

    async addCategory({ commit, state, dispatch, rootState }, data) {
      state.table_loading = true;
      state.loading_add_Category = true;
      return new Promise((resolve) => {
        commit("category_request");
        axios({
          url: `${rootState.server}` + "/api/add_category",
          data: data,
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        })
          .then((resp) => {
            commit("add_category_success", resp.data.result[0]);
            let snack_message = {};
            snack_message["color"] = "#21ce8f";
            snack_message["icon"] = "clarity:success-standard-solid";
            snack_message["text"] = resp.data.message;
            commit("SNACK_MESSAGE", snack_message, { root: true });
            setTimeout(() => {
              commit("TIME_OUT", snack_message, { root: true });
            }, 4000);
            state.table_loading = false;
            state.loading_add_Category = false;
            resolve(resp);
          })
          .catch((err) => {
            state.loading_add_Category = false;
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
    async editCategory({ commit, state, dispatch, rootState }, data) {
      state.pop_loading = true;
      console.log(data);
      return new Promise((resolve) => {
        commit("category_request");
        axios({
          url: `${rootState.server}` + "/api/update_category",
          data: data,
          headers: {
            "Content-Type": "application/json",
          },
          method: "PUT",
        })
          .then((resp) => {
            console.log(resp);
            state.pop_loading = false;
            commit("category_edit_success", resp.data.result[0]);
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
            this.commit("SNACK_MESSAGE", snack_message);
            setTimeout(() => {
              this.commit("TIME_OUT", snack_message);
            }, 4000);
          });
      });
    },
    async deleteCategory({ commit, state, dispatch, rootState }, data) {
      state.pop_loading = true;
      return new Promise((resolve) => {
        commit("category_request");
        axios({
          url: `${rootState.server}` + "/api/delete_category",
          data: data,
          headers: {
            "Content-Type": "application/json",
          },
          method: "delete",
        })
          .then((resp) => {
            state.pop_loading = false;
            commit("delete_category", data);
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
export default CategoryModule;
