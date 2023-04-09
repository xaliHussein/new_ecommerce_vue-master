<template>
  <v-card class="elevation-1">
    <!-- dailog delete ads  -->
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
                @click="deleteAds()"
              >
                تأكيد الحذف
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template>

    <!-- dailog show products by ads  -->

    <template>
      <v-row justify="center">
        <v-dialog v-model="dialog2" scrollable max-width="300px">
          <v-card>
            <v-card-title>المنتجات الخاصة بهذا الأعلان</v-card-title>
            <v-divider></v-divider>
            <v-card-text style="height: 200px" class="mt-3">
              <ul
                v-for="(product, index) in ads_products"
                :key="index"
                class="mt-2"
              >
                <v-chip color="primary">
                  {{ product.name }}
                </v-chip>
              </ul>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions dir="ltr">
              <v-btn
                class="primary"
                color="white darken-1"
                text
                @click="dialog2 = false"
              >
                غلق
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template>

    <v-data-table
      :headers="headers"
      :items="adverstments"
      :options.sync="pagination"
      :page.sync="pagination.page"
      :items-per-page="pagination.itemsPerPage"
      :loading="table_loading || false"
      hide-default-footer
      loading-text="جاري التحميل يرجى الأنتظار"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>جدول الأعلانات</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
        </v-toolbar>
      </template>

      <template v-slot:item="{ item }">
        <tr @dblclick="selectedRaw(item)">
          <td class="text-start" v-if="item.type == 0">
            <v-btn elevation="2" color="darkblue" dark :href="item.url"
              >أعلان خارجي</v-btn
            >
          </td>
          <td class="text-start" v-else>
            <v-btn
              elevation="2"
              color="darkgray"
              @click="getProducts(item.id)"
              dark
              >أعلان منتجات</v-btn
            >
          </td>

          <td class="text-start">
            <b> {{ item.expaired }}</b>
          </td>
          <td class="text-start">
            <a :href="server + item.image" id="image">
              <img
                :src="server + item.image"
                alt="image"
                width="50px"
                height="50px"
                class="img"
              />
            </a>
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
          text: "نوع الأعلان",
          value: "type",
          class: "secondary white--text title",
          sortable: false,
        },
        {
          text: "تاريخ الانتهاء",
          value: "expaired",
          class: "secondary white--text title",
        },
        {
          text: "صورة الأعلان",
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
      dialog2: false,

      pagination: {},
      items: [5, 10, 25, 50, 100],
    };
  },
  computed: {
    server() {
      return this.$store.state.server;
    },

    adsQuery: {
      set(val) {
        this.$store.state.AdsMoudle.adsQuery = val;
      },
      get() {
        return this.$store.state.AdsMoudle.adsQuery;
      },
    },
    ads_products() {
      return this.$store.state.AdsMoudle.ads_products;
    },
    pageCount: function () {
      return this.$store.state.AdsMoudle.pageCount;
    },
    totalItems: function () {
      return this.$store.state.AdsMoudle.adverstments.length;
    },

    adverstments() {
      return this.$store.state.AdsMoudle.adverstments;
    },
    table_loading() {
      return this.$store.state.AdsMoudle.table_loading;
    },
    ads_params: {
      set(val) {
        this.$store.state.AdsMoudle.params = val;
      },
      get() {
        return this.$store.state.AdsMoudle.params;
      },
    },
  },
  methods: {
    selectedRaw(item) {
      console.log(item);
      this.$store.state.AdsMoudle.selected_object = {};

      Object.assign(this.$store.state.AdsMoudle.selected_object, item);
      this.$store.state.AdsMoudle.isEdit = true;
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    },

    getProducts(id) {
      this.$store.dispatch("AdsMoudle/getProductsAds", id);
      this.dialog2 = true;
      // this.$store.dispatch("AdsMoudle/resetFields");
    },
    getItem(item) {
      this.dialog = true;
      this.item = item;
    },

    deleteAds() {
      console.log(this.item);
      this.$store.dispatch("AdsMoudle/deleteAds", this.item);
      this.dialog = false;
      this.item = {};
    },
    getAds() {
      let pagination = this.pagination;
      let par = {
        ...pagination,
      };
      this.ads_params = par;
      this.$store.dispatch("AdsMoudle/getAds");
    },
  },
  created() {
    this.$store.dispatch("AdsMoudle/resetFields");
  },
  watch: {
    pagination: {
      handler() {
        this.getAds();
      },
      deep: true,
    },
  },
};
</script>
<style></style>
