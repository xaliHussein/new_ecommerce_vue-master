<template>
  <v-container>
    <v-row justify="center" dir="rtl">
      <v-dialog :value="dialog" max-width="900px" dir="rtl">
        <v-card style="direction: rtl">
          <v-toolbar class="d-flex justify-center" color="#624fc6">
            <h2 style="color: white">تعديل المنتج</h2>
          </v-toolbar>
          <v-form ref="form">
            <v-card-text class="mt-4">
              <v-row>
                <v-col cols="12" sm="6" md="4" lg="4">
                  <v-text-field
                    v-model="product_details.name"
                    type="text"
                    label="اسم المنتج "
                    hide-details="auto"
                    :rules="rules"
                    class="font-weight-black text-field"
                    outlined
                    reverse
                    rounded
                    single-line
                    clearable></v-text-field>
                </v-col>

                <v-col cols="12" sm="6" md="4" lg="4">
                  <v-autocomplete
                    v-model="product_details.category_id"
                    :rules="rules"
                    class="font-weight-black text-field"
                    hide-details="auto"
                    item-text="name"
                    item-value="id"
                    outlined
                    reverse
                    rounded
                    single-line
                    clearable
                    :items="categories"
                    label=" اختر قسم"></v-autocomplete>
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="4">
                  <v-autocomplete
                    v-model="product_details.brand_id"
                    item-text="name"
                    :rules="rules"
                    item-value="id"
                    class="font-weight-black text-field"
                    hide-details="auto"
                    outlined
                    reverse
                    rounded
                    single-line
                    clearable
                    :items="brands"
                    label=" اختر ماركة"></v-autocomplete>
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="4">
                  <v-text-field
                    v-model="product_details.price"
                    type="number"
                    label="سعر المنتج "
                    hide-details="auto"
                    :rules="rules"
                    class="font-weight-black text-field"
                    outlined
                    reverse
                    rounded
                    single-line
                    clearable></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="4">
                  <v-text-field
                    v-model="product_details.quantity"
                    type="number"
                    :rules="rules"
                    label="الكمية"
                    hide-details="auto"
                    class="font-weight-black text-field"
                    outlined
                    reverse
                    rounded
                    single-line
                    clearable></v-text-field>
                </v-col>

                <v-col cols="12" sm="6" md="4" lg="4">
                  <v-text-field
                    v-model="product_details.barCode"
                    type="number"
                    label="اضف باركود المنتج"
                    :rules="rules"
                    hide-details="auto"
                    class="font-weight-black text-field"
                    outlined
                    reverse
                    rounded
                    single-line
                    clearable></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="4">
                  <v-text-field
                    v-if="product_details.offer > 0"
                    v-model="product_details.offer"
                    type="number"
                    label="قيمة العرض  "
                    hide-details="auto"
                    class="font-weight-black text-field"
                    outlined
                    reverse
                    rounded
                    single-line
                    clearable></v-text-field>

                  <v-text-field
                    v-else
                    v-model="offer"
                    type="number"
                    label="قيمة العرض  "
                    hide-details="auto"
                    class="font-weight-black text-field"
                    outlined
                    reverse
                    rounded
                    single-line
                    clearable></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="4">
                  <v-textarea
                    type="text"
                    :rules="rules"
                    label=" .. ادخل وصف المنتج هنا"
                    rows="1"
                    class="font-weight-black text-textarea"
                    outlined
                    reverse
                    rounded
                    single-line
                    clearable
                    v-model="product_details.desc"></v-textarea>
                </v-col>

                <v-col
                  cols="12"
                  sm="6"
                  md="4"
                  lg="4"
                  v-if="
                    (product_details.offer != null &&
                      product_details.offer != 0) ||
                    (offer != null && offer != 0)
                  ">
                  <v-menu
                    v-model="menu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto">
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        class="font-weight-black text-field"
                        outlined
                        reverse
                        rounded
                        single-line
                        clearable
                        v-model="product_details.offer_expired"
                        label="تأريخ انتهاء العرض "
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        hint="يجب ادخال تأريخ انتهاء الخصم بعد تأريخ اليوم"></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="product_details.offer_expired"
                      @input="menu = false"></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
            </v-card-text>

            <v-card-text>
              <v-form ref="form_update_details">
                <v-row>
                  <v-col cols="12" sm="6" md="5" lg="5" class="ma-0">
                    <v-combobox
                      v-model="key"
                      class="font-weight-black text-field"
                      outlined
                      reverse
                      rounded
                      single-line
                      clearable
                      label="اسم الوصف "
                      small-chips
                      :items="items"></v-combobox>
                  </v-col>
                  <v-col cols="12" sm="6" md="5" lg="5" class="ma-0">
                    <v-text-field
                      v-model="value"
                      placeholder="اضف القيمة"
                      label="اضف القيمة"
                      class="font-weight-black text-field"
                      outlined
                      reverse
                      rounded
                      single-line
                      clearable></v-text-field
                  ></v-col>
                </v-row>
                <v-col cols="12" sm="6">
                  <v-btn
                    @click="add_details"
                    color="#624fc6"
                    large
                    rounded
                    class="px-16"
                    elevation="4">
                    <h4 style="color: white; font-size: 17px">اضافة</h4>
                  </v-btn>
                </v-col>
              </v-form>
            </v-card-text>
            <v-card-text
              v-if="advance_details.length > 0"
              style="height: 250px; width: 900px"
              class="mt-3 mx-auto">
              <template>
                <v-simple-table class="">
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-center">الوصف</th>
                        <th class="text-center">القيمة</th>
                        <th class="text-center">العمليات</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(data, index) in advance_details" :key="index">
                        <td
                          class="text-center font-weight-black"
                          v-for="(objKey, indexkey) in Object.keys(data)"
                          :key="indexkey">
                          {{ objKey }}
                        </td>
                        <td
                          class="text-center font-weight-black"
                          v-for="(objKey, indexkey) in Object.keys(data)"
                          :key="indexkey">
                          {{ data[objKey] }}
                        </td>
                        <td class="text-center font-weight-black">
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn
                                @click="delete_detail(index)"
                                fab
                                icon
                                x-small
                                v-bind="attrs"
                                v-on="on">
                                <Icon
                                  icon="material-symbols:delete"
                                  color="#C62828"
                                  width="32" />
                              </v-btn>
                            </template>
                            <span>حذف القسم</span>
                          </v-tooltip>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </template>
            </v-card-text>
            <v-card-actions class="pb-5">
              <v-btn
                @click="update_details"
                :loading="loading"
                color="#624fc6"
                class="px-4"
                elevation="4">
                <h4 style="color: white; font-size: 17px">تحديث</h4>
                <template v-slot:loader>
                  <span class="custom-loader">
                    <v-icon color="white">mdi-cached</v-icon>
                  </span>
                </template>
              </v-btn>
              <v-col cols="auto">
                <v-btn outlined color="#C62828" v-on:click="$emit('popClose')">
                  <h4>اغلاق</h4>
                </v-btn>
              </v-col>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>
<script>
  import moment from "moment";
  export default {
    props: {
      product_details: {
        type: Object,
        require: true,
      },
      dialog: Boolean,
    },
    data() {
      return {
        brand: "",
        offer: null,
        menu: null,
        advance_details: [],
        input_advance_details: {},
        key: "",
        value: "",
        items: ["اللون", "الحجم"],
        rules: [(v) => !!v || "هذا الحقل مطلوب"],
      };
    },
    computed: {
      categories() {
        return this.$store.state.CategoryModule.categories;
      },
      brands() {
        return this.$store.state.BrandModule.brands;
      },
      loading() {
        return this.$store.state.ProductsMoudle.pop_loading;
      },
    },
    methods: {
      add_details() {
        if (this.$refs.form_update_details.validate()) {
          let data = {};
          data[this.key] = this.value;
          Object.assign(this.input_advance_details, data);
          this.saveAdvance_details();
          this.$refs.form_update_details.reset();
        }
      },
      saveAdvance_details() {
        this.advance_details.push(this.input_advance_details);
        this.input_advance_details = {};
      },
      delete_from_input_advance_details(key, index, value) {
        const prop = key;
        Vue.delete(this.input_advance_details, prop); // delete the property from object
      },
      delete_detail(index) {
        this.advance_details.splice(index, 1);
      },
      update_details() {
        if (this.$refs.form.validate()) {
          let data = {};
          data["id"] = this.product_details.id;
          data["name"] = this.product_details.name;
          data["barCode"] = this.product_details.barCode;
          data["quantity"] = this.product_details.quantity;
          data["category_id"] = this.product_details.category_id;
          data["brand_id"] = this.product_details.brand_id;
          data["price"] = this.product_details.price;
          data["desc"] = this.product_details.desc;
          data["advance_details"] = this.advance_details;
          data["images"] = this.upload;
          if (
            this.product_details.offer != null &&
            this.product_details.offer > 0
          ) {
            data["offer"] = this.product_details.offer;
            data["offer_expired"] = this.product_details.offer_expired;
          } else if (this.offer != null) {
            data["offer"] = this.offer;
            data["offer_expired"] = this.product_details.offer_expired;
          }
          // else {
          //   console.log("3", this.offer);
          //   data["offer"] = 0;
          //   data["offer_expired"] = "2023-04-08";
          // }

          this.$store.dispatch("ProductsMoudle/editProduct", data).then(() => {
            this.$emit("popClose");
          });
        }
        this.offer = null;
      },
    },
  };
</script>
<style scoped>
  .text-field {
    direction: ltr;
  }
  .text-textarea {
    direction: ltr;
  }
  .text-field >>> .error--text {
    text-align: right !important;
  }
</style>
