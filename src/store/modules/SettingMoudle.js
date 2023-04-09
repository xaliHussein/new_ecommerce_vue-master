import Vue from "vue";
import axios from "axios";

const SettingMoudle = {
    namespaced: true,
    state: () => ({
        settings: [],
        setting_state: "done",
        selected_object: {},
        isEdit: false,

    }),
    mutations: {
        setting_success(state, settings) {
            state.settings.splice(0, state.settings.length)
            settings.forEach(element => {
                state.settings.push(element)
            });
            console.log(state.settings)
            state.setting_state = "done"
            state.table_loading = false
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
                }).then(resp => {
                    commit('setting_success', resp.data.result)
                    dispatch("snackbarToggle", { toggle: true, text: resp.data.message }, { root: true });
                    resolve(resp);
                })
            })

        },

        async addSetting({ commit, state, dispatch, rootState }, data) {

            state.table_loading = true
            return new Promise((resolve) => {
                commit("setting_request");
                axios({
                    url: `${rootState.server}` + "/api/add_setting",
                    data: data,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "POST",
                }).then(resp => {
                    commit("add_setting_success", resp.data.result[0]);
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: resp.data.message },
                        { root: true }
                    );
                    resolve(resp);
                }).catch((err) => {
                    commit("setting_error");
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: err.response.data.message },
                        { root: true }
                    );

                    console.warn(err);
                });
            });
        },
        async editSetting({ commit, state, dispatch, rootState }, data) {
            state.table_loading = true
            console.log(data);
            return new Promise((resolve) => {
                commit("setting_request");
                axios({
                    url: `${rootState.server}` + "/api/update_setting",
                    data: data,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "PUT",
                }).then(resp => {

                    commit("setting_edit_success", resp.data.result[0])
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: resp.data.message },
                        { root: true }
                    );
                    resolve(resp);
                }).catch((err) => {

                    commit("setting_error");
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: err.response.data.message },
                        { root: true }
                    );

                    console.warn(err);
                });
            });
        },
        async deletesetting({ commit, state, dispatch, rootState }, data) {
            state.table_loading = true
            return new Promise((resolve) => {
                commit("setting_request");
                axios({
                    url: `${rootState.server}` + "/api/delete_setting",
                    data: { id: data.id },
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "delete",
                }).then(resp => {
                    // console.log(resp)
                    commit("delete_setting", data);
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: resp.data.message },
                        { root: true }
                    );
                    resolve(resp);
                }).catch((err) => {
                    commit("setting_error");
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: err.response.data.message },
                        { root: true }
                    );
                    console.warn(err);
                });
            });
        }




    }

}
export default SettingMoudle;
