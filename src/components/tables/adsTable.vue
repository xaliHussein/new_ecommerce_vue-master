<template>
  <!-- dailog delete ads  -->
  <!-- <template>
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
                @click="dialog = false">
                غلق
              </v-btn>
              <v-btn
                class="secondary"
                color="white darken-1"
                text
                @click="deleteAds()">
                تأكيد الحذف
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template> -->

  <!-- dailog show products by ads  -->

  <!-- <template>
      <v-row justify="center">
        <v-dialog v-model="dialog2" scrollable max-width="300px">
          <v-card>
            <v-card-title>المنتجات الخاصة بهذا الأعلان</v-card-title>
            <v-divider></v-divider>
            <v-card-text style="height: 200px" class="mt-3">
              <ul
                v-for="(product, index) in ads_products"
                :key="index"
                class="mt-2">
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
                @click="dialog2 = false">
                غلق
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template> -->
  <v-card class="mx-auto mt-9 card-table" width="100%">
    <v-row class="d-flex justify-center mb-9">
      <v-col cols="12" sm="12" md="12" lg="12">
        <v-data-table
          :headers="headers"
          :items="adverstments"
          :options.sync="pagination"
          :page.sync="pagination.page"
          :items-per-page="pagination.itemsPerPage"
          :loading="table_loading || false"
          hide-default-footer
          loading-text="جاري التحميل يرجى الأنتظار"
          class="data_table">
          <template v-slot:top>
            <v-toolbar flat class="mt-2">
              <v-toolbar-title>جدول الأعلانات</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
            </v-toolbar>
          </template>

          <template v-slot:item="{ item }">
            <tr>
              <td class="text-center font-weight-black" v-if="item.type == 0">
                أعلان خارجي
              </td>
              <td class="text-center font-weight-black" v-else>أعلان منتجات</td>

              <td class="text-center font-weight-black">
                <b> {{ item.expaired }}</b>
              </td>
              <td class="text-center font-weight-black">
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
                  <span>حذف الاعلان</span>
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
                  <span>تعديل الاعلان</span>
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

        <PopDeleteAds
          :value="dialogDeleteAds"
          v-on:popClose="dialogDeleteAds = !dialogDeleteAds"
          v-on:deleteAds="deleteAds()" />
        <PopUpdateAds
          :value="dialogUpdateAds"
          :updateAds="updateAds"
          :products="products"
          v-on:popClose="dialogUpdateAds = !dialogUpdateAds" />
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
  import PopUpdateAds from "@/components/ads/PopUpdateAds.vue";
  import PopDeleteAds from "@/components/ads/PopDeleteAds.vue";
  export default {
    components: { PopDeleteAds, PopUpdateAds },
    data() {
      return {
        headers: [
          {
            text: "نوع الأعلان",
            value: "type",
            class: "secondary white--text title",
            align: "center",
          },
          {
            text: "تاريخ الانتهاء",
            value: "expaired",
            class: "secondary white--text title",
            align: "center",
          },
          {
            text: "صورة الأعلان",
            value: "image",
            class: "secondary white--text title",
            align: "center",
          },

          {
            text: "العمليات",
            class: "secondary white--text title",
            align: "center",
          },
        ],
        item: {},
        delete_ads: null,
        updateAds: null,
        dialogDeleteAds: false,
        dialogUpdateAds: false,

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
      products() {
        return this.$store.state.ProductsMoudle.products;
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
      editAds(data) {
        console.log(data);
        this.$store.dispatch("AdsMoudle/editAds", data);
        this.reset();
      },

      getProducts(id) {
        this.$store.dispatch("AdsMoudle/getProductsAds", id);
        this.dialog2 = true;
        // this.$store.dispatch("AdsMoudle/resetFields");
      },
      PopDelete(item) {
        this.delete_ads = item;
        this.dialogDeleteAds = true;
      },
      popEdit(item) {
        this.updateAds = item;
        this.dialogUpdateAds = true;
      },

      deleteAds() {
        let data = {};
        data["id"] = this.delete_ads.id;
        this.$store.dispatch("AdsMoudle/deleteAds", data).then(() => {
          this.dialogDeleteAds = false;
        });
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
