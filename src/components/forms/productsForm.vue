<template>
  <v-col cols="12" sm="12" md="12" lg="12" class="pb-8">
    <v-card class="mx-auto mt-3 card">
      <v-toolbar dark color="#624fc6">
        <v-toolbar-title align-center>اضافة منتجات </v-toolbar-title>
      </v-toolbar>
      <v-form ref="form">
        <v-card-text class="mt-4">
          <v-row>
            <v-col cols="12" sm="6" md="4" lg="4">
              <v-text-field
                v-model="selected_object.name"
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
                v-model="selected_object.category_id"
                item-text="name"
                item-value="id"
                class="font-weight-black text-field"
                hide-details="auto"
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
                v-model="selected_object.brand_id"
                class="font-weight-black text-field"
                item-text="name"
                item-value="id"
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
                v-model="selected_object.price"
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
                v-model="selected_object.quantity"
                type="number"
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
                v-model="selected_object.barcode"
                type="number"
                label="اضف باركود المنتج"
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
                v-model="selected_object.offer"
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
            <v-col
              cols="12"
              sm="6"
              md="4"
              lg="4"
              v-if="
                selected_object.offer != null && selected_object.offer != 0
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
                    v-model="selected_object.offer_expired"
                    label="تأريخ انتهاء العرض "
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    hint="يجب ادخال تأريخ انتهاء الخصم بعد تأريخ اليوم"></v-text-field>
                </template>
                <v-date-picker
                  v-model="selected_object.offer_expired"
                  @input="menu = false"></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="4">
              <v-textarea
                type="test"
                label=" .. ادخل وصف المنتج هنا"
                rows="1"
                class="font-weight-black text-textarea"
                outlined
                reverse
                rounded
                single-line
                clearable
                v-model="selected_object.desc"></v-textarea>
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="4">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="#624fc6"
                    @click="dialog = true"
                    fab
                    v-bind="attrs"
                    v-on="on">
                    <Icon icon="mdi:box-eye" color="white" width="30" />
                  </v-btn>
                </template>
                <span>اضافة تفاصيل المنتج</span>
              </v-tooltip>
            </v-col>
            <v-col cols="12" sm="6" md="6" lg="6" class="mr-4">
              <div id="my-strictly-unique-vue-upload-multiple-image">
                <VueUploadMultipleImage
                  idUpload="image-upload-product"
                  idEdit="image-edit-product"
                  @upload-success="uploadImageSuccess"
                  @before-remove="beforeRemove"
                  @edit-image="editImage"
                  :data-images="images"
                  maxImageSize="5" />
              </div>
              <h3 class="mt-n4">اختر صور المنتج :</h3>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="d-flex justify-center pb-5">
          <v-btn
            @click="add_products"
            :loading="loading"
            color="#624fc6"
            large
            rounded
            class="px-16"
            elevation="4">
            <h4 style="color: white; font-size: 17px">اضافة</h4>
            <template v-slot:loader>
              <span class="custom-loader">
                <v-icon color="white">mdi-cached</v-icon>
              </span>
            </template>
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
    <v-row justify="center">
      <!-- pop details -->
      <v-dialog v-model="dialog" scrollable max-width="1000px">
        <v-card style="direction: rtl">
          <v-toolbar class="d-flex justify-center" color="#624fc6">
            <h2 style="color: white">اضافة تفاصيل المنتج</h2>
          </v-toolbar>
          <v-divider></v-divider>
          <v-form ref="form_add_details">
            <v-card-title>
              <v-col cols="12" sm="6" md="4" lg="4" class="ma-0">
                <v-combobox
                  v-model="key"
                  :rules="rules"
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
              <v-col cols="12" sm="6" md="4" lg="4" class="ma-0">
                <v-text-field
                  v-model="value"
                  :rules="rules"
                  placeholder="اضف القيمة"
                  label="اضف القيمة"
                  class="font-weight-black text-field"
                  outlined
                  reverse
                  rounded
                  single-line
                  clearable></v-text-field
              ></v-col>
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
            </v-card-title>
          </v-form>
          <v-card-text style="height: 300px; width: 900px" class="mt-3 mx-auto">
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

          <v-card-actions>
            <v-btn
              outlined
              class="px-4"
              color="#C62828"
              @click="dialog = false">
              <h4>اغلاق</h4>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- end -->
    </v-row>
  </v-col>
</template>
<script>
  import Vue from "vue";

  export default {
    data() {
      return {
        headers: [
          {
            text: "التفاصيل",
            value: "key",
            class: "secondary white--text title",
            sortable: false,
          },
          {
            text: "القيمة",
            value: "value",
            class: "secondary white--text title",
          },
        ],
        name: "",
        menu: null,
        barcode: "",
        quantity: "",
        images: [],
        items: ["اللون", "الحجم"],
        upload: [],
        advance_details: [],
        input_advance_details: {},
        key: "",
        value: "",
        category_id: null,
        rules: [(v) => !!v || "هذا الحقل مطلوب"],
        dialog: false,
      };
    },

    computed: {
      categories() {
        return this.$store.state.CategoryModule.categories;
      },
      loading() {
        return this.$store.state.ProductsMoudle.loading_add_product;
      },
      brands() {
        return this.$store.state.BrandModule.brands;
      },
      selected_object() {
        return this.$store.state.ProductsMoudle.selected_object;
      },
      isEdit() {
        return this.$store.state.ProductsMoudle.isEdit;
      },
    },
    methods: {
      delete_from_input_advance_details(key, index, value) {
        const prop = key;
        Vue.delete(this.input_advance_details, prop); // delete the property from object
      },
      delete_detail(index) {
        this.advance_details.splice(index, 1);
      },

      add_details() {
        if (this.$refs.form_add_details.validate()) {
          let data = {};
          data[this.key] = this.value;
          Object.assign(this.input_advance_details, data);
          this.saveAdvance_details();
          this.$refs.form_add_details.reset();
        }
      },
      saveAdvance_details() {
        this.advance_details.push(this.input_advance_details);
        this.input_advance_details = {};
      },
      getCategories() {
        this.$store.dispatch("CategoryModule/getCategories");
      },
      getBrands() {
        this.$store.dispatch("BrandModule/getBrands");
      },
      uploadImageSuccess(formData, index, fileList) {
        this.upload = [];
        fileList.forEach((element) => {
          let img = element.path;
          this.upload.push(img);
        });
        console.log(fileList);
      },
      beforeRemove(index, done, fileList) {
        console.log("index", index, fileList);
        var r = confirm("remove image");
        if (r == true) {
          done();
        }
      },
      editImage(formData, index, fileList) {
        console.log("edit data", formData, index, fileList);
      },
      add_products() {
        if (this.$refs.form.validate()) {
          let data = {};
          data["name"] = this.selected_object.name;
          data["barCode"] = this.selected_object.barcode;
          data["quantity"] = this.selected_object.quantity;
          data["category_id"] = this.selected_object.category_id;
          data["brand_id"] = this.selected_object.brand_id;
          data["price"] = this.selected_object.price;
          data["desc"] = this.selected_object.desc;
          data["advance_details"] = this.advance_details;
          data["images"] = this.upload;
          if (this.selected_object.offer != null) {
            data["offer"] = this.selected_object.offer;
            data["offer_expired"] = this.selected_object.offer_expired;
          }
          this.addProduct(data);
          this.reset();
        }
      },
      addProduct(data) {
        this.$store.dispatch("ProductsMoudle/addProduct", data);
      },
      editProduct(data) {
        console.log(data);
        this.$store.dispatch("ProductsMoudle/editProduct", data);
        this.reset();
      },
      reset() {
        this.$refs.form.reset();
        this.images = [];
        this.upload = [];
        this.$store.state.ProductsMoudle.isEdit = false;
      },
    },
    created() {
      this.getCategories();
      this.getBrands();
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
  .card {
    border-radius: 25px !important;
    direction: rtl;
    box-shadow: 0px 0px 0px 0px !important;
  }

  .image-container[data-v-10e59822] {
    width: 161px !important;
    height: 168px !important;
    border: 1px dashed #d6d6d6;
    border-radius: 10px;
    background-color: #fff;
  }
  .hint_image {
    position: relative;
    top: 30px;
    padding: 10px;
    color: #ff0000;
    font-weight: bold;
  }
  #customers {
    font-family: Arial, Helvetica, sans-serif;
    border-collapse: collapse;
    width: 100%;
  }

  #customers td,
  #customers th {
    border: 1px solid #ddd;
    padding: 2px;
    text-align: center !important;
    /* border-radius: 14px !important; */
  }

  #customers tr:nth-child(even) {
    background-color: #f2f2f2;
  }

  #customers tr:hover {
    background-color: #ddd;
  }

  #customers th {
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: left;
    background-color: #624fc6;
    color: white;
  }
  .hint_advance {
    position: relative;
    top: 18px;
    right: 150px;
    padding: 10px;
    color: #ff0000;
    font-weight: bold;
  }

  /* 



 [
    {
        "ss": "aaa",
        "اللون": "xxx"
    },
    {
        "الحجم": "xxx"
    },
      {
        "ss": "aaa",
        "اللون": "xxx"
    },
    {
        "الحجم": "xxx"
    }
]
*/
</style>
