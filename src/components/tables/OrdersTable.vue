<template>
  <v-card class="mx-auto mt-14 card-table" width="100%">
    <v-row class="d-flex justify-center mb-9">
      <v-col cols="12" sm="12" md="12" lg="12">
        <v-data-table
          :headers="headers"
          :items="orders"
          :options.sync="pagination"
          :page.sync="pagination.page"
          :items-per-page="pagination.itemsPerPage"
          :loading="table_loading || false"
          hide-default-footer
          loading-text="جاري التحميل يرجى الأنتظار"
          class="data_table">
          <template v-slot:top>
            <v-toolbar flat class="mt-2">
              <v-toolbar-title>جدول الطلبات</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="orderQuery"
                @input="queryChange"
                append-icon="mdi-magnify"
                label="بحث"
                class="font-weight-black"
                reverse
                outlined
                rounded
                single-line
                hide-details
                clearable></v-text-field>
            </v-toolbar>
          </template>
          <th
            v-for="header in headers"
            :key="header.text"
            :class="[
              'column sortable',
              pagination.descending ? 'desc' : 'asc',
              header.value === pagination.sortBy ? 'active' : '',
            ]"
            @click="changeSort(header.value)">
            <v-icon small>arrow_upward</v-icon>
            {{ header.text }}
          </th>
          <template v-slot:item="{ item }">
            <tr>
              <td class="text-center font-weight-black">
                {{ item.serial_number }}
              </td>
              <td class="text-center">
                <v-tooltip bottom v-if="item.status == 0">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn fab icon x-small v-bind="attrs" v-on="on">
                      <Icon
                        icon="material-symbols:hourglass-bottom-rounded"
                        color="#FF9800"
                        width="30" />
                    </v-btn>
                  </template>
                  <span>الطلب في حالة الانتضار</span>
                </v-tooltip>
                <v-tooltip bottom v-if="item.status == 1">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn fab icon x-small v-bind="attrs" v-on="on">
                      <Icon
                        icon="mdi:clipboard-text-time"
                        color="#1565C0"
                        width="30" />
                    </v-btn>
                  </template>
                  <span>تم تحويل الطلب الى شركة التوصيل</span>
                </v-tooltip>
                <v-tooltip bottom v-if="item.status == 2">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn fab icon x-small v-bind="attrs" v-on="on">
                      <Icon
                        icon="pajamas:todo-done"
                        color="#70e000"
                        width="30" />
                    </v-btn>
                  </template>
                  <span>تم تسليم الطلب</span>
                </v-tooltip>
                <v-tooltip bottom v-if="item.status == 3">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn fab icon x-small v-bind="attrs" v-on="on">
                      <Icon
                        icon="material-symbols:scan-delete"
                        color="red"
                        width="30" />
                    </v-btn>
                  </template>
                  <span>تم رفض الطلب</span>
                </v-tooltip>
              </td>
              <td class="text-center font-weight-black">
                {{ item.user.user_name }}
              </td>
              <td class="text-center font-weight-black">
                {{ item.phone_number }}
              </td>
              <td class="text-center font-weight-black">{{ item.address }}</td>
              <td
                class="text-center font-weight-black"
                style="color: green"
                v-if="item.coupon">
                {{ item.coupon.coupon_code }}
              </td>
              <td class="text-center font-weight-black" v-else>لايوجد كوبون</td>
              <td class="text-center font-weight-black" style="direction: ltr">
                {{ item.total_cost | formatNumber }} IQD
              </td>

              <td class="text-center font-weight-black">
                <span>
                  {{ moment(item.created_at).format("YYYY-MM-DD") }}
                </span>
              </td>

              <td class="text-center font-weight-black">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      @click="getProduct(item)"
                      fab
                      icon
                      x-small
                      v-bind="attrs"
                      v-on="on">
                      <Icon
                        icon="material-symbols:display-settings-rounded"
                        color="#311B92"
                        width="30" />
                    </v-btn>
                  </template>
                  <span>عرض المنتجات</span>
                </v-tooltip>
              </td>

              <td class="text-center font-weight-black" v-if="item.status == 0">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      @click="changeOrderStatus(item, (type = 3))"
                      fab
                      icon
                      x-small
                      v-bind="attrs"
                      v-on="on">
                      <Icon
                        icon="material-symbols:cancel"
                        color="#C62828"
                        width="30" />
                    </v-btn>
                  </template>
                  <span> الغاء الطلب</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      @click="changeOrderStatus(item, (type = 1))"
                      fab
                      icon
                      x-small
                      v-bind="attrs"
                      v-on="on">
                      <Icon
                        icon="mdi:archive-time"
                        color="#1976D2"
                        width="30" />
                    </v-btn>
                  </template>
                  <span> تحويل الى شركة التوصيل</span>
                </v-tooltip>
              </td>
              <td class="text-center font-weight-black" v-if="item.status == 1">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      @click="changeOrderStatus(item, (type = 3))"
                      fab
                      icon
                      x-small
                      v-bind="attrs"
                      v-on="on">
                      <Icon
                        icon="material-symbols:cancel"
                        color="#C62828"
                        width="30" />
                    </v-btn>
                  </template>
                  <span> الغاء الطلب</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      @click="changeOrderStatus(item, (type = 2))"
                      fab
                      icon
                      x-small
                      v-bind="attrs"
                      v-on="on">
                      <Icon
                        icon="clarity:success-standard-solid"
                        color="#70e000"
                        width="30" />
                    </v-btn>
                  </template>
                  <span> انهاء الطلب</span>
                </v-tooltip>
              </td>

              <td class="text-center font-weight-black" v-if="item.status == 2">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn fab icon x-small v-bind="attrs" v-on="on">
                      <Icon
                        icon="icon-park-solid:folder-success"
                        color="#70e000"
                        width="30" />
                    </v-btn>
                  </template>
                  <span> تم تسليم الطلب</span>
                </v-tooltip>
              </td>
              <td class="text-center font-weight-black" v-if="item.status == 3">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn fab icon x-small v-bind="attrs" v-on="on">
                      <Icon
                        icon="mdi:folder-cancel"
                        color="#FFD600"
                        width="30" />
                    </v-btn>
                  </template>
                  <span> تم الغاء الطلب</span>
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
        <!-- show products  -->
        <PopDisplay
          :value="dialog"
          :order_details="order_details"
          v-on:popClose="dialog = !dialog" />
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
  import PopDisplay from "@/components/orders/popDisplay.vue";
  export default {
    components: { PopDisplay },
    data() {
      return {
        headers: [
          {
            text: "رقم الطلب",
            value: "serial_number",
            align: "center",
            class: "secondary white--text title",
            sortable: false,
          },
          {
            text: "حالة الطلب ",
            value: "status",
            align: "center",
            class: "secondary white--text title",
          },
          {
            text: "اسم المستخدم",
            value: "user name",
            align: "center",
            class: "secondary white--text title",
            sortable: false,
          },
          {
            text: "رقم الهاتف",
            value: "phone_number",
            align: "center",
            class: "secondary white--text title",
          },
          {
            text: "العنوان ",
            align: "center",
            value: "address",
            class: "secondary white--text title",
          },
          {
            text: "الخصم",
            align: "center",
            value: "coupon",
            class: "secondary white--text title",
          },
          {
            text: "مجموع الطلب",
            align: "center",
            value: "total_cost",
            class: "secondary white--text title",
          },
          {
            text: "تأريخ الشراء",
            align: "center",
            value: "created_at",
            class: "secondary white--text title",
          },
          {
            text: "المنتجات",
            align: "center",
            value: "products",
            class: "secondary white--text title",
          },

          {
            text: "العمليات",
            align: "center",
            class: "secondary white--text title",
            sortable: false,
          },
        ],

        dialog: false,
        pagination: {},
        items: [5, 10, 25, 50, 100],
        order_details: {},
        // total_cost: "",
        // products: [],
        // order_user: "",
        // coupon: "",
        // created_at: "",
        // serial_number: "",
        // date_now: "",
        printObj: {
          id: "print_me",
          popTitle: "طباعة سند قبض/صرف",
          extraHead: '<meta http-equiv="Content-Language"content="en-ar"/>',
        },
      };
    },
    computed: {
      server() {
        return this.$store.state.server;
      },
      orderQuery: {
        set(val) {
          this.$store.state.OrderMoudle.orderQuery = val;
        },
        get() {
          return this.$store.state.OrderMoudle.orderQuery;
        },
      },
      pageCount: function () {
        return this.$store.state.OrderMoudle.pageCount;
      },
      totalItems: function () {
        return this.$store.state.OrderMoudle.orders.length;
      },

      orders() {
        return this.$store.state.OrderMoudle.orders;
      },
      table_loading() {
        return this.$store.state.OrderMoudle.table_loading;
      },
      order_params: {
        set(val) {
          this.$store.state.OrderMoudle.params = val;
        },
        get() {
          return this.$store.state.OrderMoudle.params;
        },
      },
    },
    methods: {
      // print(item) {
      //   this.dialog = true;
      //   this.total_cost = item.total_cost;
      //   this.serial_number = item.serial_number;
      //   item.products.forEach((element) => {
      //     this.products.push(element);
      //   });
      //   this.order_user = item.user.user_name;
      //   this.coupon = item.coupon.coupon_code;
      //   this.created_at = item.created_at;

      //   const current = new Date();
      //   const moment = require("moment");
      //   this.date_now = moment(current).format("DD-MM-YYYY");
      // },

      getProduct(item) {
        console.log(item);
        this.order_details = item;
        this.dialog = true;
      },
      changeOrderStatus(item, type) {
        console.log(item);
        console.log(type);
        let data = {};
        data["id"] = item.id;
        data["status"] = type;
        this.$store.dispatch("OrderMoudle/changeOrderStatus", data);
      },
      queryChange(val) {
        this.searchDebounce();
      },

      getOrders() {
        let pagination = this.pagination;
        let par = {
          ...pagination,
        };
        this.order_params = par;
        this.$store.dispatch("OrderMoudle/getOrders");
      },
      searchDebounce() {
        clearTimeout(this._timerId);
        // delay new call 1000ms
        this._timerId = setTimeout(() => {
          this.$store.dispatch("OrderMoudle/resetFields");
          this.pagination.page = 1;
          this.getOrders();
        }, 1000);
      },
      changeSort(column) {
        let pagination = this.users_params;
        if (pagination.sortBy[0] === column) {
          if (pagination.sortDesc[0] === true) {
            pagination.sortBy = [];
            pagination.sortDesc = [];
          } else {
            pagination.sortDesc = [true];
          }
        } else {
          pagination.sortBy = [column];
          pagination.sortDesc = [false];
        }
        this.$store.dispatch("OrderMoudle/resetFields");
        this.users_params.page = 1;
        this.users_params.sortBy = pagination.sortBy;
        this.users_params.sortDesc = pagination.sortDesc;
      },
    },
    created() {
      this.$store.dispatch("OrderMoudle/resetFields");
    },
    watch: {
      pagination: {
        handler() {
          this.getOrders();
        },
        deep: true,
      },
    },
    // to work the sorting functions must install material icone
  };
</script>
<style scoped>
  .card-table {
    box-shadow: 0px 0px 0px 0px !important;
    border-radius: 25px !important;
  }
  .v-data-table-header th {
    white-space: nowrap;
  }
  .data_table {
    direction: rtl;
  }
</style>
<style lang="scss">
  .theme--light.v-data-table
    > .v-data-table__wrapper
    > table
    > thead
    > tr
    > th {
    background-color: #624fc6 !important;
    color: #ffffff !important;
    font-family: "Cairo", sans-serif !important;
  }
  // .theme--light.v-data-table > .v-data-table__wrapper {
  //   border-radius: 14px !important;
  // }
</style>
