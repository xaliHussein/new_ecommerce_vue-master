import Vue from "vue";
import axios from "axios";

const SettingMoudle = {
  namespaced: true,
  state: () => ({
    settings: [],
    contact_us_lodding: false,
    pop_loading: false,
    setting_state: "done",
    selected_object: {},
    isEdit: false,
  }),
  mutations: {
    setting_success(state, settings) {
      state.settings.splice(0, state.settings.length);
      settings.forEach((element) => {
        state.settings.push(element);
      });
      state.setting_state = "done";
      state.table_loading = false;
    },
    setting_request(state) {
      state.setting_state = "loading";
    },

    setting_error(state) {
      state.setting_state = "error";
    },
    setting_edit_success(state, setting) {
      let index = state.settings.findIndex((e) => e.id == setting.id);
      Vue.set(state.settings, index, setting);
      state.setting_state = "done";
    },
    add_setting_success(state, setting) {
      if (setting.parent_id == null) {
        state.settings.unshift(setting);
        state.setting_state = "done";
      }
    },
  },
  actions: {
    async resetFields({ state }) {
      state.setting_state = "done";
      state.settings = [];
    },
    async getSettings({ commit, state, dispatch, rootState }) {
      if (state.setting_state != "done") return -1;
      return new Promise((resolve, reject) => {
        axios({
          url: `${rootState.server}` + "/api/get_setting",
          method: "GET",
        })
          .then((resp) => {
            commit("setting_success", resp.data.result);

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

    async addSetting({ commit, state, dispatch, rootState }, data) {
      state.contact_us_lodding = true;
      return new Promise((resolve) => {
        commit("setting_request");
        axios({
          url: `${rootState.server}` + "/api/add_setting",
          data: data,
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        })
          .then((resp) => {
            state.contact_us_lodding = false;
            commit("add_setting_success", resp.data.result[0]);
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
            state.contact_us_lodding = false;
            let snack_message = {};
            snack_message["color"] = "#B71C1C";
            snack_message["icon"] = "ri:close-circle-fill";
            snack_message["text"] = err.response.data.message;
            this.commit("SNACK_MESSAGE", snack_message);
            setTimeout(() => {
              this.commit("TIME_OUT", snack_message);
            }, 4000);
          });
      });
    },
    async editSetting({ commit, state, dispatch, rootState }, data) {
      state.contact_us_lodding = true;
      return new Promise((resolve) => {
        commit("setting_request");
        axios({
          url: `${rootState.server}` + "/api/update_setting",
          data: data,
          headers: {
            "Content-Type": "application/json",
          },
          method: "PUT",
        })
          .then((resp) => {
            state.contact_us_lodding = false;
            commit("setting_edit_success", resp.data.result[0]);
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
            state.contact_us_lodding = false;
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
    async deletesetting({ commit, state, dispatch, rootState }, data) {
      state.table_loading = true;
      return new Promise((resolve) => {
        axios({
          url: `${rootState.server}` + "/api/delete_setting",
          data: { id: data.id },
          headers: {
            "Content-Type": "application/json",
          },
          method: "delete",
        })
          .then((resp) => {
            commit("delete_setting", data);
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
    async change_password({ commit, state, dispatch, rootState }, data) {
      state.table_loading = true;
      return new Promise((resolve) => {
        commit("setting_request");
        axios({
          url: `${rootState.server}` + "/api/change_password",
          data: data,
          headers: {
            "Content-Type": "application/json",
          },
          method: "PUT",
        })
          .then((resp) => {
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
export default SettingMoudle;
