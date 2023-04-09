import Vue from "vue";
import axios from "axios";

const UserModule = {
    namespaced: true,
    state: () => ({
        users: [],
        admins: [],
        user_state: "done",
        table_loading: false,
        userQuery: "",
        selected_object: {},
        isEdit: false,
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
            state.users.splice(0, state.users.length)
            users.forEach(element => {
                state.users.push(element)
            });
            state.user_state = "done"
            state.table_loading = false
        },
        admin_success(state, admins) {
            state.admins.splice(0, state.admins.length)
            admins.forEach(element => {
                state.admins.push(element)
            });
            state.user_state = "done"
            state.table_loading = false
        },
        user_request(state) {
            state.user_state = "loading";
        },

        user_error(state) {
            state.user_state = "error";
        },

        add_user_success(state, user) {
            state.admins.unshift(user);
            state.user_state = "done";
            state.table_loading = false;
        },
        user_edit_success(state, user) {
            let index = state.admins.findIndex((e) => e.id == user.id);
            Vue.set(state.admins, index, user);
            state.user_state = "done";
            state.table_loading = false;
        },
        toggle_active_user(state, user) {
            let index = state.users.findIndex((e) => e.id == user.id);

            Vue.set(state.users, index, user);
            state.user_state = "done";
            state.table_loading = false;
        },
        delete_user(state, user) {
            console.log(user)
            let index = state.admins.findIndex((e) => e.id == user.id);
            state.admins.splice(index, 1)
            state.user_state = "done";
            state.table_loading = false;
        }

    },
    actions: {
        async resetFields({ state }) {
            state.user_state = "done";
            // state.users = [];
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
            if (state.user_state != "done") return -1;
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
                    url: `${rootState.server}` + "/api/get_all_users" + "?skip=" + skip + "&limit=" + limit + query,
                    method: "GET",
                }).then(resp => {
                    state.table_loading = false;
                    state.pageCount = resp.data.count;
                    commit('user_success', resp.data.result)
                    dispatch("snackbarToggle", { toggle: true, text: resp.data.message }, { root: true });
                    resolve(resp);
                })
            })

        },
        async getAdmins({ commit, state, dispatch, rootState }) {
            if (state.user_state != "done") return -1;
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
                    url: `${rootState.server}` + "/api/get_admins" + "?skip=" + skip + "&limit=" + limit + query,
                    method: "GET",
                }).then(resp => {
                    state.table_loading = false;
                    state.pageCount = resp.data.count;
                    commit('admin_success', resp.data.result)
                    dispatch("snackbarToggle", { toggle: true, text: resp.data.message }, { root: true });
                    resolve(resp);
                })
            })

        },
        async addUser({ commit, state, dispatch, rootState }, data) {

            state.table_loading = true
            return new Promise((resolve) => {
                commit("user_request");
                axios({
                    url: `${rootState.server}` + "/api/add_user",
                    data: data,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "POST",
                }).then(resp => {
                    state.table_loading = false;
                    commit("add_user_success", resp.data.result[0]);
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: resp.data.message },
                        { root: true }
                    );
                    resolve(resp);
                }).catch((err) => {
                    state.table_loading = false;
                    commit("user_error");
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: err.response.data.message },
                        { root: true }
                    );

                    console.warn(err);
                });
            });
        },
        async editUser({ commit, state, dispatch, rootState }, data) {
            state.table_loading = true
            console.log(data);
            return new Promise((resolve) => {
                commit("user_request");
                axios({
                    url: `${rootState.server}` + "/api/update_admin",
                    data: data,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "PUT",
                }).then(resp => {
                    console.log(resp);
                    state.table_loading = false
                    commit("user_edit_success", resp.data.result[0])
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: resp.data.message },
                        { root: true }
                    );
                    resolve(resp);
                }).catch((err) => {
                    state.table_loading = false;
                    commit("user_error");
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: err.response.data.message },
                        { root: true }
                    );

                    console.warn(err);
                });
            });
        },
        async deleteUser({ commit, state, dispatch, rootState }, data) {
            state.table_loading = true
            return new Promise((resolve) => {
                commit("user_request");
                axios({
                    url: `${rootState.server}` + "/api/delete_user",
                    data: { id: data.id },
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "delete",
                }).then(resp => {
                    state.table_loading = false;
                    // console.log(resp)
                    commit("delete_user", data);
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: resp.data.message },
                        { root: true }
                    );
                    resolve(resp);
                }).catch((err) => {
                    state.table_loading = false;
                    commit("user_error");
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: err.response.data.message },
                        { root: true }
                    );
                    console.warn(err);
                });
            });
        },
        async toggleActive({ commit, state, dispatch, rootState }, data) {
            state.table_loading = true
            return new Promise((resolve) => {
                commit("user_request");
                axios({
                    url: `${rootState.server}` + "/api/toggle_active",
                    data: { id: data.id },
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "PUT",
                }).then(resp => {
                    state.table_loading = false;
                    commit("toggle_active_user", resp.data.result[0]);
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: resp.data.message },
                        { root: true }
                    );
                    resolve(resp);
                }).catch((err) => {
                    state.table_loading = false;
                    commit("user_error");
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
export default UserModule;
