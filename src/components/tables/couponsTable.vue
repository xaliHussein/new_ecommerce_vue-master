<template>
  <v-card class="mx-auto mt-9 card-table" width="100%">
    <v-row class="d-flex justify-center mb-9">
      <v-col cols="12" sm="12" md="12" lg="12">
        <v-data-table
          :headers="headers"
          :items="coupons"
          :options.sync="pagination"
          :page.sync="pagination.page"
          :items-per-page="pagination.itemsPerPage"
          :loading="table_loading || false"
          hide-default-footer
          loading-text="جاري التحميل يرجى الأنتظار"
          class="data_table">
          <template v-slot:top>
            <v-toolbar flat class="mt-2">
              <v-toolbar-title>جدول الخصومات</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="couponQuery"
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
                {{ item.coupon_code }}
              </td>
              <td class="text-center font-weight-black">
                {{ item.coupon_ratio }}
              </td>
              <td class="text-center font-weight-black">
                {{ item.max_users }}
              </td>
              <td class="text-center font-weight-black">
                {{ item.min_value }}
              </td>

              <td class="text-center font-weight-black">{{ item.expaired }}</td>
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
                  <span>حذف الخصم</span>
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
                  <span>تعديل الخصم</span>
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
        <PopDeleteCoupon
          :value="dialogDelete"
          v-on:popClose="dialogDelete = !dialogDelete"
          v-on:deleteCoupon="deleteCoupon()" />
        <PopUpdateCoupon
          :dialogEdit="dialogEdit"
          :updateCoupon="updateCoupon"
          v-on:popClose="dialogEdit = !dialogEdit" />
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
  import PopDeleteCoupon from "@/components/coupon/PopDeleteCoupon.vue";
  import PopUpdateCoupon from "@/components/coupon/PopUpdateCoupon.vue";
  export default {
    components: { PopDeleteCoupon, PopUpdateCoupon },
    data() {
      return {
        headers: [
          {
            text: "كود الخصم",
            value: "copon_code",
            class: "secondary white--text title",
            align: "center",
          },
          {
            text: "قيمة الخصم",
            value: "coupon_ratio",
            class: "secondary white--text title",
            align: "center",
          },
          {
            text: "اقصى عدد مستخدمين",
            value: "max_users",
            class: "secondary white--text title",
            align: "center",
          },
          {
            text: "اقل قيمة للأستخدام",
            value: "min_value",
            class: "secondary white--text title",
            align: "center",
          },
          {
            text: "تأريخ الانتهاء",
            value: "expaired",
            class: "secondary white--text title",
            align: "center",
          },
          {
            text: "العمليات",
            class: "secondary white--text title",
            align: "center",
            align: "center",
          },
        ],

        delete_coupon: null,
        updateCoupon: null,
        dialogDelete: false,
        dialogEdit: false,
        pagination: {},
        items: [5, 10, 25, 50, 100],
      };
    },
    computed: {
      couponQuery: {
        set(val) {
          this.$store.state.CouponModule.couponQuery = val;
        },
        get() {
          return this.$store.state.CouponModule.couponQuery;
        },
      },
      pageCount: function () {
        return this.$store.state.CouponModule.pageCount;
      },
      totalItems: function () {
        return this.$store.state.CouponModule.coupons.length;
      },

      coupons() {
        return this.$store.state.CouponModule.coupons;
      },
      table_loading() {
        return this.$store.state.CouponModule.table_loading;
      },
      coupon_params: {
        set(val) {
          this.$store.state.CouponModule.params = val;
        },
        get() {
          return this.$store.state.CouponModule.params;
        },
      },
    },
    methods: {
      queryChange(val) {
        this.searchDebounce();
      },
      PopDelete(item) {
        this.delete_coupon = item;
        this.dialogDelete = true;
      },
      popEdit(item) {
        this.updateCoupon = item;
        this.dialogEdit = true;
      },

      deleteCoupon() {
        let data = {};
        data["id"] = this.delete_coupon.id;
        this.$store.dispatch("CouponModule/deleteCoupon", data).then(() => {
          this.dialogDelete = false;
        });
      },
      getCoupons() {
        let pagination = this.pagination;
        let par = {
          ...pagination,
        };
        this.coupon_params = par;
        this.$store.dispatch("CouponModule/getCoupons");
      },
      searchDebounce() {
        clearTimeout(this._timerId);
        this._timerId = setTimeout(() => {
          this.$store.dispatch("CouponModule/resetFields");
          this.pagination.page = 1;
          this.getCoupons();
        }, 1000);
      },
      changeSort(column) {
        let pagination = this.coupons_params;
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
        this.$store.dispatch("CouponModule/resetFields");
        this.coupons_params.page = 1;
        this.coupons_params.sortBy = pagination.sortBy;
        this.coupons_params.sortDesc = pagination.sortDesc;
      },
    },
    created() {
      this.$store.dispatch("CouponModule/resetFields");
    },
    watch: {
      pagination: {
        handler() {
          this.getCoupons();
        },
        deep: true,
      },
    },
    // to work the sorting functions must install material icone
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
