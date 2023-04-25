<template>
  <!-- <template>
      <v-row justify="center">
        <v-dialog v-model="dialog" persistent max-width="390">
          <v-card>
            <v-card-title class="text-h5 secondary white--text">
              تغير حالة المستخدم
            </v-card-title>
            <v-card-text class="mt-5 text-h5 dark--text"
              ><b> هل أنت متأكد من عملية تغير حالة المستخدم </b></v-card-text
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
                @click="deleteUser()"
              >
                 الحذف
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template> -->
  <v-card class="mx-auto mt-10 card-table" width="100%">
    <v-row class="d-flex justify-center mb-9">
      <v-col cols="12" sm="12" md="12" lg="12">
        <v-data-table
          :headers="headers"
          :items="users"
          :options.sync="pagination"
          :page.sync="pagination.page"
          :items-per-page="pagination.itemsPerPage"
          :loading="table_loading || false"
          hide-default-footer
          loading-text="جاري التحميل يرجى الأنتظار"
          class="data_table">
          <template v-slot:top>
            <v-toolbar flat class="mt-2">
              <v-toolbar-title>جدول المستخدمين</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="userQuery"
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
                {{ item.user_name }}
              </td>
              <td class="text-center font-weight-black">
                {{ item.phone_number }}
              </td>
              <td class="text-center font-weight-black">
                <span>{{ moment(item.created_at).format("YYYY-MM-DD") }}</span>
              </td>

              <td class="text-center font-weight-black">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-if="item.active == 1"
                      @click="getItem(item)"
                      fab
                      icon
                      x-small
                      v-bind="attrs"
                      v-on="on">
                      <Icon icon="mdi:user-block" color="#C62828" width="32" />
                    </v-btn>
                  </template>
                  <span>الغاء تفعيل</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-if="item.active == 0"
                      @click="getItem(item)"
                      fab
                      icon
                      x-small
                      v-bind="attrs"
                      v-on="on">
                      <Icon icon="mdi:user-check" color="#70e000" width="32" />
                    </v-btn>
                  </template>
                  <span>تفعيل</span>
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
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
  export default {
    data() {
      return {
        headers: [
          {
            text: "اسم المستخدم",
            value: "user name",
            class: "secondary white--text title",
            align: "center",
            sortable: false,
          },
          {
            text: "رقم الهاتف",
            value: "phone_number",
            class: "secondary white--text title",
            align: "center",
          },
          {
            text: "تأريخ الانضمام",
            value: "created_at",
            class: "secondary white--text title",
            align: "center",
          },
          {
            text: "الحذف",
            class: "secondary white--text title",
            sortable: false,
            align: "center",
          },
        ],
        item: {},
        dialog: false,
        pagination: {},
        items: [5, 10, 25, 50, 100],
      };
    },
    computed: {
      userQuery: {
        set(val) {
          this.$store.state.UserModule.userQuery = val;
        },
        get() {
          return this.$store.state.UserModule.userQuery;
        },
      },
      pageCount: function () {
        return this.$store.state.UserModule.pageCount;
      },
      totalItems: function () {
        return this.$store.state.UserModule.users.length;
      },

      users() {
        return this.$store.state.UserModule.users;
      },
      table_loading() {
        return this.$store.state.UserModule.table_loading;
      },
      user_params: {
        set(val) {
          this.$store.state.UserModule.params = val;
        },
        get() {
          return this.$store.state.UserModule.params;
        },
      },
    },
    methods: {
      selectedRaw(item) {
        console.log(item);
        this.$store.state.UserModule.selected_object = {};
        Object.assign(this.$store.state.UserModule.selected_object, item);
        this.$store.state.UserModule.isEdit = true;
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
        this.$store.dispatch("UserModule/toggleActive", item);
        this.$store.dispatch("UserModule/getUsers");
      },

      // deleteUser() {
      //   console.log(this.item);
      //   this.$store.dispatch("UserModule/deleteUser", this.item);
      //   this.dialog = false;
      //   this.item = {};
      // },
      getUsers() {
        let pagination = this.pagination;
        let par = {
          ...pagination,
        };
        this.user_params = par;
        this.$store.dispatch("UserModule/getUsers");
      },
      searchDebounce() {
        clearTimeout(this._timerId);
        // delay new call 1000ms
        this._timerId = setTimeout(() => {
          this.$store.dispatch("UserModule/resetFields");
          this.pagination.page = 1;
          this.getUsers();
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
        this.$store.dispatch("UserModule/resetFields");
        this.users_params.page = 1;
        this.users_params.sortBy = pagination.sortBy;
        this.users_params.sortDesc = pagination.sortDesc;
      },
    },
    created() {
      this.$store.dispatch("UserModule/resetFields");
    },
    watch: {
      pagination: {
        handler() {
          this.getUsers();
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
