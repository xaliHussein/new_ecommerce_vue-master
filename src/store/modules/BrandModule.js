import Vue from "vue";
import axios from "axios";

const BrandModule = {
  namespaced: true,
  state: () => ({
    brands: [],
    brand_state: "done",
    table_loading: false,
    loading_add_brand: false,
    pop_loading: false,
    brandQuery: "",
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
    brand_success(state, brands) {
      state.brands.splice(0, state.brands.length);
      brands.forEach((element) => {
        state.brands.push(element);
      });
      state.brand_state = "done";
      state.table_loading = false;
    },
    brand_request(state) {
      state.brand_state = "loading";
    },

    brand_error(state) {
      state.brand_state = "error";
    },
    brand_edit_success(state, brand) {
      let index = state.brands.findIndex((e) => e.id == brand.id);
      Vue.set(state.brands, index, brand);
      state.brand_state = "done";
      state.table_loading = false;
    },
    add_brand_success(state, brand) {
      if (brand.parent_id == null) {
        state.brands.unshift(brand);
        state.brand_state = "done";
        state.table_loading = false;
      }
    },
    delete_brand(state, brand) {
      let index = state.brands.findIndex((e) => e.id == brand.id);
      state.brands.splice(index, 1);
      state.brand_state = "done";
      state.table_loading = false;
    },
  },
  actions: {
    async resetFields({ state }) {
      state.brand_state = "done";
      state.brands = [];
      state.pageCount = 1;
      state.table_loading = false;
      state.params = {
        sortBy: [],
        sortDesc: [],
        page: 1,
        itemsPerPage: 10,
      };
    },
    async getBrands({ commit, state, dispatch, rootState }) {
      if (state.brand_state != "done") return -1;
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
          state.brandQuery != undefined &&
          state.brandQuery != null &&
          state.brandQuery.length > 0
        )
          query = `&query=${state.brandQuery}`;
        console.log(query);
        console.log(skip, limit);

        axios({
          url:
            `${rootState.server}` +
            "/api/get_brands" +
            "?skip=" +
            skip +
            "&limit=" +
            limit +
            sort +
            query,
          method: "GET",
        }).then((resp) => {
          state.table_loading = false;
          state.pageCount = resp.data.count;

          commit("brand_success", resp.data.result);
          dispatch(
            "snackbarToggle",
            { toggle: true, text: resp.data.message },
            { root: true }
          );
          resolve(resp);
        });
      });
    },

    async addBrand({ commit, state, dispatch, rootState }, data) {
      state.table_loading = true;
      state.loading_add_brand = true;
      return new Promise((resolve) => {
        commit("brand_request");
        axios({
          url: `${rootState.server}` + "/api/add_brand",
          data: data,
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        })
          .then((resp) => {
            state.table_loading = false;
            state.loading_add_brand = false;
            commit("add_brand_success", resp.data.result[0]);
            dispatch(
              "snackbarToggle",
              { toggle: true, text: resp.data.message },
              { root: true }
            );
            resolve(resp);
          })
          .catch((err) => {
            state.table_loading = false;
            state.loading_add_brand = false;
            commit("brand_error");
            dispatch(
              "snackbarToggle",
              { toggle: true, text: err.response.data.message },
              { root: true }
            );
          });
      });
    },
    async editBrand({ commit, state, dispatch, rootState }, data) {
      state.pop_loading = true;
      console.log(data);
      return new Promise((resolve) => {
        commit("brand_request");
        axios({
          url: `${rootState.server}` + "/api/update_brand",
          data: data,
          headers: {
            "Content-Type": "application/json",
          },
          method: "PUT",
        })
          .then((resp) => {
            state.pop_loading = false;
            commit("brand_edit_success", resp.data.result[0]);
            dispatch(
              "snackbarToggle",
              { toggle: true, text: resp.data.message },
              { root: true }
            );
            resolve(resp);
          })
          .catch((err) => {
            state.pop_loading = false;
            commit("brand_error");
            dispatch(
              "snackbarToggle",
              { toggle: true, text: err.response.data.message },
              { root: true }
            );
          });
      });
    },
    async deleteBrand({ commit, state, dispatch, rootState }, data) {
      state.pop_loading = true;
      return new Promise((resolve) => {
        commit("brand_request");
        axios({
          url: `${rootState.server}` + "/api/delete_brand",
          data: { id: data.id },
          headers: {
            "Content-Type": "application/json",
          },
          method: "delete",
        })
          .then((resp) => {
            state.pop_loading = false;
            commit("delete_brand", data);
            dispatch(
              "snackbarToggle",
              { toggle: true, text: resp.data.message },
              { root: true }
            );
            resolve(resp);
          })
          .catch((err) => {
            state.pop_loading = false;
            commit("brand_error");
            dispatch(
              "snackbarToggle",
              { toggle: true, text: err.response.data.message },
              { root: true }
            );
          });
      });
    },
  },
};
export default BrandModule;
