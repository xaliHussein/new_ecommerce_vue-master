<template>
  <!-- images dialog -->
  <!-- <template>
      <v-row justify="center">
        <v-dialog v-model="dialogImages" persistent max-width="900">
          <v-card>
            <v-card-title class="text-h5 secondary white--text">
              صور المنتج
            </v-card-title>
            <v-card-text class="mt-5 text-h5 dark--text">
              <v-row>
                <v-col
                  v-for="(data, index) in item.images"
                  :key="index"
                  cols="12"
                  sm="3">
                  <v-btn
                    v-if="item.images.length > 1"
                    @click="deleteImage(data)"
                    class="imgDelete"
                    icon
                    color="red">
                    <i class="fa fa-close fa-lg" aria-hidden="true"></i>
                  </v-btn>
                  <a :href="server + data.image">
                    <img
                      :src="server + data.image"
                      alt="image"
                      width="150px"
                      height="150px"
                      class="img" /> </a
                ></v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                class="secondary"
                color="white darken-1"
                text
                @click="dialogImages = false">
                غلق
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template> -->
  <!-- info dialog -->
  <!-- <template>
      <v-row justify="center">
        <v-dialog v-model="dialogInfo" persistent max-width="600">
          <v-card>
            <v-card-title>التفاصيل </v-card-title>
            <v-divider></v-divider>
            <v-card-text style="height: 300px; width: 500px" class="mt-3">
              <table id="customers">
                <tr>
                  <th>التفاصيل</th>
                  <th>القيمة</th>
                </tr>
                <tr v-for="(data, index) in this.info" :key="index">
                  <th>
                    <span
                      v-for="(objKey, indexkey) in Object.keys(data)"
                      :key="indexkey">
                      {{ objKey }} =>{{ data[objKey] }} <br
                    /></span>
                  </th>
                  <th>
                    <v-btn color="red" icon dark @click="delete_detail(index)">
                      <i class="fa fa-close fa-lg" aria-hidden="true"></i>
                    </v-btn>
                  </th>
                </tr>
              </table>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions dir="ltr">
              <v-btn
                class="primary"
                color="white darken-1"
                text
                @click="dialogInfo = false">
                غلق
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template> -->
  <v-card class="mx-auto mt-9 mb-9 card-table">
    <v-row class="d-flex justify-center mb-9">
      <v-col cols="12" sm="12" md="12" lg="12">
        <v-data-table
          :headers="headers"
          :items="products"
          :options.sync="pagination"
          :page.sync="pagination.page"
          :items-per-page="pagination.itemsPerPage"
          :loading="table_loading || false"
          hide-default-footer
          loading-text="جاري التحميل يرجى الأنتظار"
          class="data_table">
          <template v-slot:top>
            <v-toolbar flat class="mt-5">
              <v-toolbar-title>جدول المنتجات</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="productQuery"
                @input="queryChange"
                append-icon="mdi-magnify"
                label="ادخل اسم المنتج او باركود"
                class="font-weight-black text-field"
                reverse
                outlined
                rounded
                single-line
                hide-details
                clearable></v-text-field>
            </v-toolbar>
          </template>

          <template v-slot:item="{ item }">
            <tr>
              <td class="text-center font-weight-black">{{ item.name }}</td>
              <td class="text-center font-weight-black">
                {{ item.category.name }}
              </td>
              <td class="text-center font-weight-black">
                {{ item.brand.name }}
              </td>
              <td class="text-center font-weight-black">
                {{ item.price | formatNumber }}
              </td>
              <td class="text-center font-weight-black">{{ item.desc }}</td>
              <td class="text-center font-weight-black">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      @click="PopDelete(item.id)"
                      fab
                      icon
                      x-small
                      v-bind="attrs"
                      v-on="on">
                      <Icon
                        icon="ic:round-delete-forever"
                        color="#C62828"
                        width="30" />
                    </v-btn>
                  </template>
                  <span>حذف المنتج</span>
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
                  <span>تعديل المنتج</span>
                </v-tooltip>
              </td>
            </tr>
          </template>
        </v-data-table>

        <div class="text-center pt-2">
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
        <PopEdit
          :dialog="dialog"
          :product_details="product_details"
          v-on:popClose="dialog = !dialog" />
        <PopDeletePorduct
          :value="dialogDelete"
          v-on:deleteProduct="deleteProduct()"
          v-on:popClose="dialogDelete = !dialogDelete" />
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
  import About from "@/views/About.vue";
  import PopEdit from "@/components/products/PopEdit.vue";
  import PopDeletePorduct from "@/components/products/PopDeletePorduct.vue";
  export default {
    components: { About, PopEdit, PopDeletePorduct },
    data() {
      return {
        headers: [
          {
            text: "اسم المنتج",
            value: "name",
            class: "secondary white--text title",
            align: "center",
          },
          {
            text: "القسم",
            value: "category",
            class: "secondary white--text title",
            align: "center",
          },
          {
            text: "الماركة",
            value: "brand",
            class: "secondary white--text title",
            align: "center",
          },
          {
            text: "السعر",
            value: "price",
            class: "secondary white--text title",
            align: "center",
          },
          {
            text: "الوصف",
            value: "desc",
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
        dialogDelete: false,
        delete_product_id: "",
        dialog: false,
        pagination: {},
        info: [],
        // advance_details_info: {},
        product_details: {},
        items: [5, 10, 25, 50, 100],
      };
    },
    computed: {
      server() {
        return this.$store.state.server;
      },

      productQuery: {
        set(val) {
          this.$store.state.ProductsMoudle.productQuery = val;
        },
        get() {
          return this.$store.state.ProductsMoudle.productQuery;
        },
      },
      pageCount: function () {
        return this.$store.state.ProductsMoudle.pageCount;
      },
      totalItems: function () {
        return this.$store.state.ProductsMoudle.products.length;
      },

      products() {
        return this.$store.state.ProductsMoudle.products;
      },
      table_loading() {
        return this.$store.state.ProductsMoudle.table_loading;
      },
      product_params: {
        set(val) {
          this.$store.state.ProductsMoudle.params = val;
        },
        get() {
          return this.$store.state.ProductsMoudle.params;
        },
      },
      // advance() {
      //   let data = this.item.advance_details;
      //   Object.assign(this.advance_details_info, JSON.parse(data));
      //   console.log(JSON.parse(data));
      //   return this.advance_details_info;
      // },
      //
    },

    methods: {
      delete_detail(index) {
        console.log("here");

        let data = {};
        data["id"] = this.item.id;
        data["index"] = index;
        console.log(data);
        this.$store.dispatch("ProductsMoudle/deleteAdvanceDetails", data);
        // this.info.splice(index, 1);
        this.dialogInfo = false;
        // location.reload();
      },
      PopDelete(id) {
        this.delete_product_id = id;
        this.dialogDelete = true;
      },

      popEdit(item) {
        this.product_details = item;
        this.dialog = true;
      },
      queryChange(val) {
        this.searchDebounce();
      },
      // getItem(item, type) {
      //   this.item = item;
      //   if (type == "delete") this.dialogDelete = true;
      //   else if (type == "images") this.dialogImages = true;
      //   else if (type == "info") {
      //     this.dialogInfo = true;
      //     this.info = JSON.parse(item.advance_details);
      //     console.log(this.info);
      //   }
      // },
      deleteImage(item) {
        console.log(item);
        let data = {};
        data["id"] = item.id;
        data["product_id"] = item.product_id;
        this.$store.dispatch("ProductsMoudle/deleteImage", data);
        this.dialogImages = false;
      },
      deleteProduct() {
        let data = {};
        data["id"] = this.delete_product_id;
        this.$store.dispatch("ProductsMoudle/deleteProduct", data).then(() => {
          this.dialogDelete = false;
          this.delete_product_id = "";
        });
      },
      getProducts() {
        let pagination = this.pagination;
        let par = {
          ...pagination,
        };
        this.product_params = par;
        this.$store.dispatch("ProductsMoudle/getProducts");
      },
      searchDebounce() {
        clearTimeout(this._timerId);
        // delay new call 1000ms
        this._timerId = setTimeout(() => {
          this.$store.dispatch("ProductsMoudle/resetFields");
          this.pagination.page = 1;
          this.getProducts();
        }, 1000);
      },
    },
    created() {
      this.$store.dispatch("ProductsMoudle/resetFields");
    },
    watch: {
      pagination: {
        handler() {
          this.getProducts();
        },
        deep: true,
      },
    },
  };
</script>
<style scoped>
  .card-table {
    box-shadow: 0px 0px 0px 0px !important;
    border-radius: 25px !important;
  }
  .data_table {
    direction: rtl;
  }

  .imgDelete {
    position: absolute;
    top: -70;
    right: 25;
  }
  .imgDelete:hover {
    width: 50px;
  }
  .text-field {
    direction: ltr;
  }
</style>
