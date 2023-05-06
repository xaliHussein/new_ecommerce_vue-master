import Vue from "vue";
import axios from "axios";

const UserModule = {
  namespaced: true,
  state: () => ({
    users: [],
    admins: [],
    id: null,
    phone_number: null,
    table_loading: false,
    add_user_loading: false,
    edit_admin_loading: false,
    pop_loading: false,
    userQuery: "",
    selected_object: {},
    pageCount: 1,
    params: {
      sortBy: [],
      sortDesc: [],
      page: 1,
      itemsPerPage: 10,
    },
  }),
  mutations: {
    user_success(state, users) {
      state.users.splice(0, state.users.length);
      users.forEach((element) => {
        state.users.push(element);
      });
      state.table_loading = false;
    },
    admin_success(state, admins) {
      state.admins.splice(0, state.admins.length);
      admins.forEach((element) => {
        state.admins.push(element);
      });
      state.table_loading = false;
    },

    user_error(state) {
      state.user_state = "error";
    },

    add_user_success(state, user) {
      state.admins.unshift(user);
      state.table_loading = false;
    },
    user_edit_success(state, user) {
      let index = state.admins.findIndex((e) => e.id == user.id);
      Vue.set(state.admins, index, user);
      state.table_loading = false;
    },
    toggle_active_user(state, user) {
      let index = state.users.findIndex((e) => e.id == user.id);

      Vue.set(state.users, index, user);
      state.table_loading = false;
    },
    delete_user(state, user) {
      let index = state.admins.findIndex((e) => e.id == user.id);
      state.admins.splice(index, 1);
      state.table_loading = false;
    },
    info_auth(state, user) {
      state.phone_number = user.phone_number;
      state.id = user.id;
    },

    change_user_name(user) {
      localStorage.removeItem("full_name");
      localStorage.setItem("full_name", user.user_name);
      state.phone_number = user.phone_number;
    },
  },
  actions: {
    async resetFields({ state }) {
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
    async getUsers({ commit, state, dispatch, rootState }) {
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
          state.userQuery != undefined &&
          state.userQuery != null &&
          state.userQuery.length > 0
        )
          query = `&query=${state.userQuery}`;

        axios({
          url:
            `${rootState.server}` +
            "/api/get_all_users" +
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
            commit("user_success", resp.data.result);
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
    async getAdmins({ commit, state, dispatch, rootState }) {
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
          state.userQuery != undefined &&
          state.userQuery != null &&
          state.userQuery.length > 0
        )
          query = `&query=${state.userQuery}`;

        axios({
          url:
            `${rootState.server}` +
            "/api/get_admins" +
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
            commit("admin_success", resp.data.result);
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
    async addUser({ commit, state, dispatch, rootState }, data) {
      state.table_loading = true;
      state.add_user_loading = true;
      return new Promise((resolve) => {
        axios({
          url: `${rootState.server}` + "/api/add_user",
          data: data,
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        })
          .then((resp) => {
            state.table_loading = false;
            state.add_user_loading = false;
            commit("add_user_success", resp.data.result[0]);
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
            state.add_user_loading = false;
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
    async editUser({ commit, state, dispatch, rootState }, data) {
      state.table_loading = true;
      state.pop_loading = true;
      return new Promise((resolve) => {
        axios({
          url: `${rootState.server}` + "/api/update_admin",
          data: data,
          headers: {
            "Content-Type": "application/json",
          },
          method: "PUT",
        })
          .then((resp) => {
            state.table_loading = false;
            state.pop_loading = false;
            commit("user_edit_success", resp.data.result[0]);
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
    async update_password({ commit, state, rootState }, data) {
      state.edit_admin_loading = true;
      return new Promise((resolve) => {
        axios({
          url: `${rootState.server}` + "/api/update_password",
          data: data,
          headers: {
            "Content-Type": "application/json",
          },
          method: "PUT",
        })
          .then((resp) => {
            state.edit_admin_loading = false;
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
            state.edit_admin_loading = false;
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
    async change_info_admin({ commit, state, rootState }, data) {
      state.edit_admin_loading = true;
      return new Promise((resolve) => {
        axios({
          url: `${rootState.server}` + "/api/change_info_admin",
          data: data,
          headers: {
            "Content-Type": "application/json",
          },
          method: "PUT",
        })
          .then((resp) => {
            commit("change_user_name", resp.data.result[0]);
            state.edit_admin_loading = false;
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
            state.edit_admin_loading = false;
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
    async deleteUser({ commit, state, dispatch, rootState }, data) {
      state.table_loading = true;
      state.pop_loading = true;
      return new Promise((resolve) => {
        axios({
          url: `${rootState.server}` + "/api/delete_user",
          data: { id: data.id },
          headers: {
            "Content-Type": "application/json",
          },
          method: "delete",
        })
          .then((resp) => {
            state.table_loading = false;
            state.pop_loading = false;

            commit("delete_user", data);
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
    async toggleActive({ commit, state, dispatch, rootState }, data) {
      state.table_loading = true;
      return new Promise((resolve) => {
        axios({
          url: `${rootState.server}` + "/api/toggle_active",
          data: { id: data.id },
          headers: {
            "Content-Type": "application/json",
          },
          method: "PUT",
        })
          .then((resp) => {
            state.table_loading = false;
            commit("toggle_active_user", resp.data.result[0]);
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
    async info_auth({ commit, state, dispatch, rootState }) {
      state.pop_loading = true;
      return new Promise((resolve) => {
        axios({
          url: `${rootState.server}` + "/api/info_auth",
          method: "GET",
        })
          .then((resp) => {
            state.pop_loading = false;
            commit("info_auth", resp.data.result[0]);

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
export default UserModule;
