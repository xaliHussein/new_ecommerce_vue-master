<template>
  <v-card
    class="mx-auto card-table"
    width="100%"
    :class="user_type == 2 ? 'mt-9' : 'mt-13'">
    <v-row class="d-flex justify-center mb-9">
      <v-col cols="12" sm="12" md="12" lg="12">
        <v-data-table
          :headers="headers"
          :items="admins"
          :options.sync="pagination"
          :page.sync="pagination.page"
          :items-per-page="pagination.itemsPerPage"
          :loading="table_loading || false"
          hide-default-footer
          loading-text="جاري التحميل يرجى الأنتظار"
          class="data_table">
          <template v-slot:top>
            <v-toolbar flat class="mt-2">
              <v-toolbar-title>جدول المشرفين</v-toolbar-title>
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
                {{ item.created_at | moment("dddd, MMMM Do YYYY") }}
              </td>

              <td class="text-center font-weight-black">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      :disabled="user_type == 0 ? true : false"
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
                  <span>حذف المشرف</span>
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
                  <span>تعديل معلومات المشرف</span>
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
        <PopDeleteAdmin
          :value="dialogDeleteAdmin"
          v-on:popClose="dialogDeleteAdmin = !dialogDeleteAdmin"
          v-on:deleteAdmin="deleteAdmin()" />
        <PopUpdateAdmin
          :value="dialogUpdateAdmin"
          :updateAdmin="updateAdmin"
          v-on:popClose="dialogUpdateAdmin = !dialogUpdateAdmin" />
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
  import PopDeleteAdmin from "@/components/admin/PopDeleteAdmin.vue";
  import PopUpdateAdmin from "@/components/admin/PopUpdateAdmin.vue";
  export default {
    components: { PopDeleteAdmin, PopUpdateAdmin },
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
            align: "center",
            sortable: false,
          },
        ],
        item: {},

        delete_admin: {},
        updateAdmin: {},
        dialogDeleteAdmin: false,
        dialogUpdateAdmin: false,
        pagination: {},
        items: [5, 10, 25, 50, 100],
      };
    },
    created() {
      this.$store.dispatch("UserModule/resetFields");
    },
    mounted() {
      this.$store.dispatch("UserModule/getAdmins");
      console.log("jjd");
    },
    computed: {
      user_type() {
        return localStorage.getItem("user_type");
      },
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

      admins() {
        return this.$store.state.UserModule.admins;
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
      user_type() {
        return localStorage.getItem("user_type");
      },
    },
    methods: {
      queryChange(val) {
        this.searchDebounce();
      },
      PopDelete(item) {
        this.delete_admin = item;
        this.dialogDeleteAdmin = true;
      },
      popEdit(item) {
        this.updateAdmin = item;
        this.dialogUpdateAdmin = true;
      },
      deleteAdmin() {
        let data = {};
        data["id"] = this.delete_admin.id;
        this.$store.dispatch("UserModule/deleteUser", data).then(() => {
          this.dialogDeleteAdmin = false;
        });
      },
      getAdmins() {
        let pagination = this.pagination;
        let par = {
          ...pagination,
        };
        this.user_params = par;
        this.$store.dispatch("UserModule/getAdmins");
      },
      searchDebounce() {
        clearTimeout(this._timerId);
        // delay new call 1000ms
        this._timerId = setTimeout(() => {
          this.$store.dispatch("UserModule/resetFields");
          this.pagination.page = 1;
          this.getAdmins();
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

    watch: {
      pagination: {
        handler() {
          this.getAdmins();
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
