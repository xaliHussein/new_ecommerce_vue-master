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
                @click="deleteCoupon()"
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
      :items="coupons"
      :options.sync="pagination"
      :page.sync="pagination.page"
      :items-per-page="pagination.itemsPerPage"
      :loading="table_loading || false"
      hide-default-footer
      loading-text="جاري التحميل يرجى الأنتظار"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>جدول الخصومات</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="couponQuery"
            @input="queryChange"
            append-icon="mdi-magnify"
            label="بحث"
            single-line
            hide-details
            class="mr-5"
          ></v-text-field>
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
        @click="changeSort(header.value)"
      >
        <v-icon small>arrow_upward</v-icon>
        {{ header.text }}
      </th>
      <template v-slot:item="{ item }">
        <tr @dblclick="selectedRaw(item)">
          <td class="text-start">{{ item.coupon_code }}</td>
          <td class="text-start">{{ item.coupon_ratio }}</td>
          <td class="text-start">{{ item.max_users }}</td>
          <td class="text-start">{{ item.min_value }}</td>

          <td class="text-start">{{ item.expaired }}</td>
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
          text: "كود الخصم",
          value: "copon_code",
          class: "secondary white--text title",
          sortable: false,
        },
        {
          text: "قيمة الخصم",
          value: "coupon_ratio",
          class: "secondary white--text title",
        },
        {
          text: "اقصى عدد مستخدمين",
          value: "max_users",
          class: "secondary white--text title",
        },
        {
          text: "اقل قيمة للأستخدام",
          value: "min_value",
          class: "secondary white--text title",
        },
        {
          text: "تأريخ الانتهاء",
          value: "expaired",
          class: "secondary white--text title",
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
    selectedRaw(item) {
      console.log(item);
      this.$store.state.CouponModule.selected_object = {};
      Object.assign(this.$store.state.CouponModule.selected_object, item);
      this.$store.state.CouponModule.isEdit = true;
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    },
    queryChange(val) {
      this.searchDebounce();
    },
    getItem(item) {
      this.dialog = true;
      this.item = item;
    },

    deleteCoupon() {
      console.log(this.item);
      this.$store.dispatch("CouponModule/deleteCoupon", this.item);
      this.dialog = false;
      this.item = {};
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
      // delay new call 1000ms
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
<style></style>
