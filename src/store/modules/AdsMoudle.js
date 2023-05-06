import Vue from "vue";
import axios from "axios";

const AdsMoudle = {
  namespaced: true,
  state: () => ({
    adverstments: [],
    ads_products: [],
    ads_state: "done",
    table_loading: false,
    loading_add_ads: false,
    pop_loading: false,
    adsQuery: "",
    pageCount: 1,
    selected_object: {},
    isEdit: false,
    params: {
      sortBy: [],
      sortDesc: [],
      page: 1,
      itemsPerPage: 10,
    },
  }),
  mutations: {
    ads_products_success(state, ads_products) {
      state.ads_products.splice(0, state.ads_products.length);
      ads_products.forEach((element) => {
        state.ads_products.push(element);
      });
    },
    ads_success(state, adverstments) {
      state.adverstments.splice(0, state.adverstments.length);
      adverstments.forEach((element) => {
        state.adverstments.push(element);
      });
      state.ads_state = "done";
      state.table_loading = false;
    },
    ads_request(state) {
      state.ads_state = "loading";
    },

    ads_error(state) {
      state.ads_state = "error";
    },
    ads_edit_success(state, ads) {
      let index = state.adverstments.findIndex((e) => e.id == ads.id);
      Vue.set(state.adverstments, index, ads);
      state.ads_state = "done";
      state.table_loading = false;
    },
    add_ads_success(state, ads) {
      state.adverstments.unshift(ads);
      state.ads_state = "done";
      state.table_loading = false;
    },
    delete_ads(state, ads) {
      let index = state.adverstments.findIndex((e) => e.id == ads.id);
      state.adverstments.splice(index, 1);
      state.ads_state = "done";
      state.table_loading = false;
    },
  },
  actions: {
    async resetFields({ state }) {
      state.ads_state = "done";
      // state.adverstments = [];
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
    async getAds({ commit, state, dispatch, rootState }) {
      if (state.ads_state != "done") return -1;
      state.table_loading = true;
      let data = state.params;
      // let ads_id = id ? id : null
      // console.log("here", ads_id)
      state.table_loading = true;
      return new Promise((resolve, reject) => {
        let skip = (data.page - 1) * data.itemsPerPage;
        let limit = data.itemsPerPage;
        let sort = "";
        if (data.sortBy.length > 0)
          sort = `&${data.sortBy[0]}=${data.sortDesc}`;
        // console.log(ads_id)
        // if (ads_id != null) {
        //     var ads = "&ads_id=" + ads_id
        // } else {
        //     var ads = ""
        // }
        // console.log(ads)
        axios({
          url:
            `${rootState.server}` +
            "/api/get_ads" +
            "?skip=" +
            skip +
            "&limit=" +
            limit +
            sort,
          method: "GET",
        })
          .then((resp) => {
            state.table_loading = false;
            state.pageCount = resp.data.count;
            commit("ads_success", resp.data.result);

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
    async getProductsAds({ commit, state, dispatch, rootState }, id) {
      axios({
        url: `${rootState.server}` + "/api/get_ads?ads_id=" + id,
        method: "GET",
      })
        .then((resp) => {
          commit("ads_products_success", resp.data.result);
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
    },

    async addAds({ commit, state, dispatch, rootState }, data) {
      state.table_loading = true;
      state.loading_add_ads = true;
      return new Promise((resolve) => {
        commit("ads_request");
        axios({
          url: `${rootState.server}` + "/api/add_ads",
          data: data,
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        })
          .then((resp) => {
            state.table_loading = false;
            state.loading_add_ads = false;
            commit("add_ads_success", resp.data.result[0]);
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
            state.loading_add_ads = false;
            commit("ads_error");
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
    async editAds({ commit, state, dispatch, rootState }, data) {
      state.pop_loading = true;
      state.table_loading = true;
      console.log(data);
      return new Promise((resolve) => {
        commit("ads_request");
        axios({
          url: `${rootState.server}` + "/api/update_ads",
          data: data,
          headers: {
            "Content-Type": "application/json",
          },
          method: "PUT",
        })
          .then((resp) => {
            state.pop_loading = false;
            state.table_loading = false;
            commit("ads_edit_success", resp.data.result[0]);
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
    async deleteAds({ commit, state, dispatch, rootState }, data) {
      state.pop_loading = true;
      return new Promise((resolve) => {
        commit("ads_request");
        axios({
          url: `${rootState.server}` + "/api/delete_ads",
          data: { id: data.id },
          headers: {
            "Content-Type": "application/json",
          },
          method: "delete",
        })
          .then((resp) => {
            state.pop_loading = false;

            commit("delete_ads", data);
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
            commit("ads_error");
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
export default AdsMoudle;
