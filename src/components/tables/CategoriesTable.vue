<template>
  <v-card class="mx-auto mt-9 card-table" width="100%">
    <v-row class="d-flex justify-center mb-9">
      <v-col cols="12" sm="12" md="12" lg="12">
        <v-data-table
          :headers="headers"
          :items="categories"
          :options.sync="pagination"
          :page.sync="pagination.page"
          :items-per-page="pagination.itemsPerPage"
          :loading="table_loading || false"
          hide-default-footer
          loading-text="جاري التحميل يرجى الأنتظار"
          class="data_table">
          <template v-slot:top>
            <v-toolbar flat class="mt-2">
              <v-toolbar-title>جدول الاقسام</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="categoryQuery"
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
            <tr @dblclick="selectedRaw(item)">
              <td class="text-center font-weight-black">{{ item.name }}</td>
              <td class="text-center font-weight-black">
                <v-avatar rounded size="100">
                  <img :src="server + item.icone" alt="image" />
                </v-avatar>
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
        <PopDelete
          :value="dialog"
          v-on:popClose="dialog = !dialog"
          v-on:deleteCategory="deleteCategory()" />
        <PopUpdateCategory
          :value="dialogEdit"
          :updateCategory="updateCategory"
          v-on:popClose="dialogEdit = !dialogEdit" />
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
  import PopDelete from "@/components/categories/PopDeleteCategory.vue";
  export default {
    components: { PopDelete },
    data() {
      return {
        headers: [
          {
            text: "اسم القسم",
            value: "name",
            class: "secondary white--text title",
            align: "center",
          },
          {
            text: "صورة القسم",
            value: "icone",
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
        delete_category: null,
        dialog: false,
        dialogEdit: false,
        updateCategory: null,
        pagination: {},
        items: [5, 10, 25, 50, 100],
      };
    },
    computed: {
      server() {
        return this.$store.state.server;
      },

      categoryQuery: {
        set(val) {
          this.$store.state.CategoryModule.categoryQuery = val;
        },
        get() {
          return this.$store.state.CategoryModule.categoryQuery;
        },
      },
      pageCount: function () {
        return this.$store.state.CategoryModule.pageCount;
      },

      categories() {
        return this.$store.state.CategoryModule.categories;
      },
      table_loading() {
        return this.$store.state.CategoryModule.table_loading;
      },
      category_params: {
        set(val) {
          this.$store.state.CategoryModule.params = val;
        },
        get() {
          return this.$store.state.CategoryModule.params;
        },
      },
    },
    methods: {
      selectedRaw(item) {
        console.log(item);
        this.$store.state.CategoryModule.selected_object = {};
        Object.assign(this.$store.state.CategoryModule.selected_object, item);
        this.$store.state.CategoryModule.isEdit = true;
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
      },
      queryChange(val) {
        this.searchDebounce();
      },
      PopDelete(item) {
        this.delete_category = item;
        this.dialog = true;
      },
      popEdit(item) {
        console.log(item);
        this.updateCategory = item;
        this.dialogEdit = true;
      },

      deleteCategory() {
        let data = {};
        data["id"] = this.delete_category.id;
        this.$store.dispatch("CategoryModule/deleteCategory", data);
        this.dialog = false;
        this.delete_category = {};
      },
      getCategories() {
        let pagination = this.pagination;
        let par = {
          ...pagination,
        };
        this.category_params = par;
        this.$store.dispatch("CategoryModule/getCategories");
      },
      searchDebounce() {
        clearTimeout(this._timerId);
        // delay new call 1000ms
        this._timerId = setTimeout(() => {
          this.$store.dispatch("CategoryModule/resetFields");
          this.pagination.page = 1;
          this.getCategories();
        }, 1000);
      },
    },
    created() {
      this.$store.dispatch("CategoryModule/resetFields");
    },
    watch: {
      pagination: {
        handler() {
          this.getCategories();
        },
        deep: true,
      },
    },
  };
</script>
<style scoped>
  .hint_category {
    color: #f44336;
    font-size: 12px;
    font-weight: bold;
  }
  .children_count {
    font-size: 24px;
    margin-left: 125px !important;
  }
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
