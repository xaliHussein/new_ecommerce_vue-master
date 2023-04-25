<template>
  <v-card class="mx-auto mt-9 card-table" width="100%">
    <v-row class="d-flex justify-center mb-9">
      <v-col cols="12" sm="12" md="12" lg="12">
        <v-data-table
          :headers="headers"
          :items="brands"
          :options.sync="pagination"
          :page.sync="pagination.page"
          :items-per-page="pagination.itemsPerPage"
          :loading="table_loading || false"
          hide-default-footer
          loading-text="جاري التحميل يرجى الأنتظار"
          class="data_table">
          <template v-slot:top>
            <v-toolbar flat class="mt-2">
              <v-toolbar-title>العلامة التجارية</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="brandQuery"
                @input="queryChange"
                append-icon="mdi-magnify"
                label="بحث"
                class="font-weight-black text-field"
                reverse
                outlined
                rounded
                clearable
                single-line
                hide-details></v-text-field>
            </v-toolbar>
          </template>

          <template v-slot:item="{ item }">
            <tr>
              <td class="text-center text-center font-weight-black">
                {{ item.name }}
              </td>
              <td class="text-center text-center font-weight-black">
                <a :href="server + item.image" id="image">
                  <img
                    :src="server + item.image"
                    alt="image"
                    width="50px"
                    height="50px"
                    class="img" />
                </a>
              </td>

              <td class="text-center font-weight-black">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      @click="PopDelete(item)"
                      fab
                      icon
                      x-small
                      v-bind="attrs"
                      v-on="on">
                      <Icon
                        icon="ic:round-delete-forever"
                        color="#C62828"
                        width="32" />
                    </v-btn>
                  </template>
                  <span>حذف القسم</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      @click="popEdit(item)"
                      fab
                      icon
                      x-small
                      v-bind="attrs"
                      v-on="on">
                      <Icon
                        icon="mdi:application-edit"
                        color="#311B92"
                        width="30" />
                    </v-btn>
                  </template>
                  <span>تعديل القسم</span>
                </v-tooltip>
              </td>
            </tr>
          </template>
        </v-data-table>
        <div class="text-center py-5">
          <v-row>
            <v-spacer></v-spacer>
            <v-col align-self="center" cols="5" sm="5" md="3" lg="3">
              <v-select
                v-model="pagination.itemsPerPage"
                :items="items"
                outlined
                rounded
                single-line
                hide-details
                reverse
                label="عدد العناصر"></v-select>
            </v-col>
            <v-col align-self="center" cols="5" sm="5" md="3" lg="3">
              <v-pagination
                v-model="pagination.page"
                :length="pageCount"
                circle
                color="#624fc6"></v-pagination>
            </v-col>
          </v-row>
        </div>
        <PopDeleteBrand
          :value="dialogDeleteBrand"
          v-on:popClose="dialogDeleteBrand = !dialogDeleteBrand"
          v-on:deleteBrand="deleteBrand()" />
        <PopUpdateBrand
          :value="dialogUpdateBrand"
          :updateBrand="updateBrand"
          v-on:popClose="dialogUpdateBrand = !dialogUpdateBrand" />
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
  import PopDeleteBrand from "@/components/brands/PopDeleteBrand.vue";
  import PopUpdateBrand from "@/components/brands/PopUpdateBrand.vue";
  export default {
    components: { PopDeleteBrand, PopUpdateBrand },
    data() {
      return {
        headers: [
          {
            text: "اسم الماركة",
            value: "name",
            align: "center",
            class: "secondary white--text title",
          },
          {
            text: "صورة الماركة",
            value: "image",
            align: "center",
            class: "secondary white--text title",
          },
          {
            text: "العمليات",
            class: "secondary white--text title",
            align: "center",
          },
        ],
        delete_brand: {},
        updateBrand: {},
        dialogDeleteBrand: false,
        dialogUpdateBrand: false,
        pagination: {},
        items: [5, 10, 25, 50, 100],
      };
    },
    computed: {
      server() {
        return this.$store.state.server;
      },

      brandQuery: {
        set(val) {
          this.$store.state.BrandModule.brandQuery = val;
        },
        get() {
          return this.$store.state.BrandModule.brandQuery;
        },
      },
      pageCount: function () {
        return this.$store.state.BrandModule.pageCount;
      },
      totalItems: function () {
        return this.$store.state.BrandModule.brands.length;
      },

      brands() {
        return this.$store.state.BrandModule.brands;
      },
      table_loading() {
        return this.$store.state.BrandModule.table_loading;
      },
      brand_params: {
        set(val) {
          this.$store.state.BrandModule.params = val;
        },
        get() {
          return this.$store.state.BrandModule.params;
        },
      },
    },
    methods: {
      queryChange(val) {
        this.searchDebounce();
      },
      PopDelete(item) {
        this.dialogDeleteBrand = true;
        this.delete_brand = item;
        console.log("this.delete_brand", this.delete_brand);
      },
      popEdit(item) {
        this.updateBrand = item;
        this.dialogUpdateBrand = true;
      },

      deleteBrand() {
        let data = {};
        data["id"] = this.delete_brand.id;
        this.$store.dispatch("BrandModule/deleteBrand", data).then(() => {
          this.dialogDeleteBrand = false;
        });
      },
      getBrands() {
        let pagination = this.pagination;
        let par = {
          ...pagination,
        };
        this.brand_params = par;
        this.$store.dispatch("BrandModule/getBrands");
      },
      searchDebounce() {
        clearTimeout(this._timerId);
        // delay new call 1000ms
        this._timerId = setTimeout(() => {
          this.$store.dispatch("BrandModule/resetFields");
          this.pagination.page = 1;
          this.getBrands();
        }, 1000);
      },
    },
    created() {
      this.$store.dispatch("BrandModule/resetFields");
    },
    watch: {
      pagination: {
        handler() {
          this.getBrands();
        },
        deep: true,
      },
    },
  };
</script>
<style scoped>
  .data_table {
    direction: rtl;
  }
  .card-table {
    box-shadow: 0px 0px 0px 0px !important;
    border-radius: 25px !important;
  }
  .text-field {
    direction: ltr;
  }
</style>
