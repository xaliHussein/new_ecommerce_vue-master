<template>
  <v-card class="elevation-1">
    <template>
      <v-row justify="center">
        <v-dialog v-model="dialog" persistent max-width="390">
          <v-card>
            <v-card-title class="text-h5 secondary white--text">
              حذف القسم
            </v-card-title>
            <v-card-text class="mt-5 text-h5 dark--text"
              ><b> هل أنت متأكد من عملية الحذف </b></v-card-text
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                class="secondary"
                color="white darken-1"
                text
                @click="dialog = false"
              >
                غلق
              </v-btn>
              <v-btn
                class="secondary"
                color="white darken-1"
                text
                @click="deleteBrand()"
              >
                تأكيد الحذف
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template>
    <v-data-table
      :headers="headers"
      :items="brands"
      :options.sync="pagination"
      :page.sync="pagination.page"
      :items-per-page="pagination.itemsPerPage"
      :loading="table_loading || false"
      hide-default-footer
      loading-text="جاري التحميل يرجى الأنتظار"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>جدول الاقسام</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="brandQuery"
            @input="queryChange"
            append-icon="mdi-magnify"
            label="بحث"
            single-line
            hide-details
            class="mr-5"
          ></v-text-field>
        </v-toolbar>
      </template>

      <template v-slot:item="{ item }">
        <tr @dblclick="selectedRaw(item)">
          <td class="text-start">{{ item.name }}</td>
          <td class="text-start">
            <img
              :src="server + item.image"
              alt="image"
              width="50px"
              height="50px"
            />
          </td>
          <td class="text-start">
            <v-btn dark color="red" @click="getItem(item)">حذف </v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>
    <div class="text-center pt-2">
      <v-row>
        <v-col offset="4" cols="2">
          <v-select
            v-model="pagination.itemsPerPage"
            :items="items"
            label="عدد العناصر في الصفحة"
          ></v-select>
        </v-col>
        <v-col cols="6">
          <v-pagination
            v-model="pagination.page"
            :length="pageCount"
            circle
          ></v-pagination>
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>
<script>
export default {
  data() {
    return {
      headers: [
        {
          text: "اسم الماركة",
          value: "name",
          class: "secondary white--text title",
          sortable: false,
        },
        {
          text: "صورة الماركة",
          value: "image",
          class: "secondary white--text title",
          sortable: false,
        },
        {
          text: "الحذف",
          class: "secondary white--text title",
          sortable: false,
        },
      ],
      item: {},
      dialog: false,
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
    // scrollToTop: function () {
    //   document
    //     .getElementById("scroll-to-top")
    //     .scrollIntoView({ behavior: "smooth" });
    // },
    selectedRaw(item) {
      console.log(item);
      this.$store.state.BrandModule.selected_object = {};
      Object.assign(this.$store.state.BrandModule.selected_object, item);
      this.$store.state.BrandModule.isEdit = true;
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
      // this.scrollToTop();
      // if (this.selectedItem != null && index == this.selectedItem) {
      //   this.selectedItem = null;
      // } else {
      //   this.selectedItem = index;
      // }
    },
    queryChange(val) {
      this.searchDebounce();
    },
    getItem(item) {
      this.dialog = true;
      this.item = item;
    },

    deleteBrand() {
      console.log(this.item);
      this.$store.dispatch("BrandModule/deleteBrand", this.item);
      this.dialog = false;
      this.item = {};
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
<style></style>
