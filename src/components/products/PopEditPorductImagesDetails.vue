<template>
  <v-container>
    <v-row justify="center" dir="rtl">
      <v-dialog
        :value="dialog"
        width="1000px"
        hight="1000px"
        dir="rtl"
        persistent>
        <v-card style="direction: rtl">
          <v-toolbar dark color="#624fc6" class="d-flex justify-center">
            <v-toolbar-title class="d-flex justify-center" align-center
              >تعديل تفاصيل و صور المنتج
            </v-toolbar-title>
          </v-toolbar>
          <v-tabs
            v-model="tab"
            color="deep-purple accent-4"
            class="d-flex justify-center mt-2 tabs"
            icons-and-text>
            <v-tabs-slider></v-tabs-slider>

            <v-tab>
              <h4>تفاصيل المنتج</h4>
              <Icon
                icon="mingcute:list-check-3-line"
                color="#311B92"
                width="35" />
            </v-tab>

            <v-tab>
              <h4>صور المنتج</h4>
              <Icon icon="ion:images" color="#311B92" width="30" />
            </v-tab>
          </v-tabs>

          <v-tabs-items v-model="tab">
            <!--tab details -->
            <v-tab-item>
              <v-card flat>
                <v-form ref="form_update_details">
                  <v-card-text class="mt-4">
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
                          :rules="rules"
                          :items="items"></v-combobox>
                      </v-col>
                      <v-col cols="12" sm="6" md="5" lg="5" class="ma-0">
                        <v-text-field
                          v-model="value"
                          label="اضف القيمة"
                          class="font-weight-black text-field"
                          outlined
                          reverse
                          rounded
                          single-line
                          :rules="rules"
                          clearable></v-text-field
                      ></v-col>
                      <v-col cols="12" sm="6">
                        <v-btn
                          @click="add_details"
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
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-form>

                <v-card-text class="mt-3 mx-auto">
                  <v-data-table
                    :headers="headers"
                    :items="productImgDet"
                    :loading="loading_delete || false"
                    hide-default-footer
                    loading-text="جاري التحميل يرجى الأنتظار"
                    class="data_table">
                    <template v-slot:item="{ item }">
                      <tr
                        v-for="(data, index) in Object.assign(
                          JSON.parse(item.advance_details)
                        )"
                        :key="index + item.id">
                        <td
                          class="text-center font-weight-black"
                          v-for="(objKey, indexkey) in Object.keys(data)"
                          :key="indexkey">
                          {{ objKey }}
                        </td>
                        <td
                          class="text-center font-weight-black"
                          v-for="(objKey, indexkey) in Object.keys(data)"
                          :key="indexkey + item.id">
                          {{ data[objKey] }}
                        </td>
                        <td class="text-center font-weight-black">
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn
                                :id="item.id"
                                @click="delete_detail(index, item.id)"
                                :loading="
                                  loading_delete && indexClicked === index
                                "
                                color="white"
                                fab
                                icon
                                x-small
                                v-bind="attrs"
                                v-on="on">
                                <Icon
                                  icon="ic:round-delete-forever"
                                  color="#C62828"
                                  width="30" />
                                <template v-slot:loader>
                                  <span class="custom-loader">
                                    <v-icon color="#C62828">mdi-cached</v-icon>
                                  </span>
                                </template>
                              </v-btn>
                            </template>
                            <span>حذف</span>
                          </v-tooltip>
                        </td>
                      </tr>
                    </template>
                  </v-data-table>
                </v-card-text>
                <v-card-actions class="pb-5">
                  <v-btn
                    outlined
                    color="#C62828"
                    v-on:click="$emit('popClose')">
                    <h4>اغلاق</h4>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card style="box-shadow: 0 0">
                <v-container fluid class="mt-3">
                  <v-row>
                    <v-col cols="12" md="12">
                      <div
                        id="unique-vue-upload-multiple-image"
                        class="mt-5"
                        style="display: flex; justify-content: center">
                        <VueUploadMultipleImage
                          idUpload="image-upload-images"
                          idEdit="image-edit-images"
                          @upload-success="uploadImageSuccess"
                          @before-remove="beforeRemove"
                          @edit-image="editImage"
                          :data-images="images"
                          dragText="اضف صور"
                          browseText=""
                          primaryText="تم الاضافة بنجاح"
                          maxImageSize="5" />
                      </div>
                      <h3 class="text-center mt-n4">اضف صور متعدده لمنتج :</h3>
                    </v-col>
                    <v-col
                      v-for="(image, index) in productImgDet[0].images"
                      :key="index + image.id"
                      cols="6"
                      sm="6"
                      md="3"
                      lg="3">
                      <v-card :width="200" class="mx-auto mt-2 col-food">
                        <v-img
                          class="img"
                          :src="server + image.image"
                          :lazy-src="server + image.image"
                          aspect-ratio="1"
                          :width="200"></v-img>
                        <div v-if="selectedImage" class="overlay">
                          <v-img
                            class="mt-12"
                            :src="server + selectedImage"
                            alt=""
                            height="95vh"
                            contain
                            dark
                            @click.stop="selectedImage = null">
                          </v-img>
                        </div>

                        <div class="event">
                          <v-btn
                            class="ma-2 btn"
                            fab
                            color="white"
                            @click="toggleFullscreen(image.image)">
                            <Icon
                              icon="fluent:slide-size-24-filled"
                              color="#624FC6"
                              width="32" />
                          </v-btn>

                          <v-btn
                            class="ma-2 btn"
                            fab
                            color="primary"
                            @click="delete_images(image.id, image.product_id)">
                            <Icon
                              icon="ic:round-delete-forever"
                              color="white"
                              width="32" />
                          </v-btn>
                        </div>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-container>
                <v-card-actions class="pb-5">
                  <v-btn
                    outlined
                    color="#C62828"
                    v-on:click="$emit('popClose')">
                    <h4>اغلاق</h4>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>
<script>
  export default {
    props: {
      productImgDet: {
        type: Array,
        require: true,
      },
      dialog: Boolean,
    },
    data() {
      return {
        tab: 1,
        selectedImage: null,
        indexClicked: null,
        upload: [],
        images: [],
        input_advance_details: {},
        new_advance_details: [],
        key: "",
        value: "",
        items: ["اللون", "الحجم", "القياس"],
        rules: [(v) => !!v || "هذا الحقل مطلوب"],
        headers: [
          {
            text: " الوصف",
            value: "name",
            class: "secondary white--text title",
            align: "center",
            sortable: false,
          },
          {
            text: "القيمة",
            value: "category",
            class: "secondary white--text title",
            align: "center",
            sortable: false,
          },
          {
            text: "العمليات",
            value: "brand",
            class: "secondary white--text title",
            align: "center",
            sortable: false,
          },
        ],
      };
    },
    computed: {
      categories() {
        return this.$store.state.CategoryModule.categories;
      },
      brands() {
        return this.$store.state.BrandModule.brands;
      },
      server() {
        return this.$store.state.server;
      },
      loading() {
        return this.$store.state.ProductsMoudle.pop_loading;
      },
      loading_delete() {
        return this.$store.state.ProductsMoudle.table_delete_loading;
      },
    },
    methods: {
      add_details() {
        if (this.$refs.form_update_details.validate()) {
          let data = {};
          data[this.key] = this.value;
          Object.assign(this.input_advance_details, data);
          this.saveAdvance_details();
          this.update_details(2);
          this.$refs.form_update_details.reset();
        }
      },
      saveAdvance_details() {
        if (this.productImgDet[0].advance_details != null) {
          this.new_advance_details = JSON.parse(
            this.productImgDet[0].advance_details
          );
          this.new_advance_details.push(this.input_advance_details);
        } else {
          this.new_advance_details.push(this.input_advance_details);
        }

        this.input_advance_details = {};
      },
      delete_detail(index, id) {
        this.indexClicked = index;
        let data = {};
        data["id"] = id;
        data["index"] = index;
        this.$store
          .dispatch("ProductsMoudle/deleteAdvanceDetails", data)
          .then((resp) => {
            this.productImgDet[0].advance_details =
              resp.data.result[0].advance_details;
          });
      },
      // حذف صور المنتج
      delete_images(image_id, product_id) {
        console.log("ss");
        let data = {};
        data["id"] = image_id;
        data["product_id"] = product_id;
        this.$store
          .dispatch("ProductsMoudle/deleteImage", data)
          .then((resp) => {
            this.productImgDet[0].images = resp.data.result[0].images;
          });
      },
      toggleFullscreen(image) {
        this.selectedImage = image;
      },

      // تحديث تفاصيل المنتج
      update_details(val) {
        let data = {};
        data["id"] = this.productImgDet[0].id;
        data["name"] = this.productImgDet[0].name;
        data["barCode"] = this.productImgDet[0].barCode;
        data["quantity"] = this.productImgDet[0].quantity;
        data["category_id"] = this.productImgDet[0].category_id;
        data["brand_id"] = this.productImgDet[0].brand_id;
        data["price"] = this.productImgDet[0].price;
        data["desc"] = this.productImgDet[0].desc;
        if (this.new_advance_details.length > 0) {
          data["advance_details"] = this.new_advance_details;
        }
        if (
          this.productImgDet[0].offer != null &&
          this.productImgDet[0].offer > 0
        ) {
          data["offer"] = this.productImgDet[0].offer;
          data["offer_expired"] = this.productImgDet[0].offer_expired;
        } else {
          data["offer"] = null;
        }
        if (this.upload.length > 0) {
          data["images"] = this.upload;
        }

        this.$store
          .dispatch("ProductsMoudle/editProduct", data)
          .then((resp) => {
            if (val == 1) {
              this.productImgDet[0].images = resp.data.result[0].images;
              this.upload = [];
              this.images = [];
            } else if (val == 2) {
              this.productImgDet[0].advance_details =
                resp.data.result[0].advance_details;
              this.new_advance_details = null;
            }
          });
      },
      uploadImageSuccess(formData, index, fileList) {
        this.upload = [];
        fileList.forEach((element) => {
          let img = element.path;
          this.upload.push(img);
        });

        this.update_details(1);
      },
      beforeRemove(index, done, fileList) {
        console.log("index", index, fileList);
        var r = confirm("سوف يتم حذف الصورة");
        if (r == true) {
          done();
          this.upload.splice(index, 1);
        }
      },
      editImage(formData, index, fileList) {
        console.log("edit data", formData, index, fileList);
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
  .event {
    position: absolute;
    left: 0;
    text-align: center;
    padding: 20px;
    width: 100%;
    bottom: 0;
  }
  .event .btn {
    margin: 0 0 20px;
    transform: translateY(-20px);
    opacity: 0;
  }
  .col-food:hover .event .btn {
    opacity: 1;
  }
  .col-food {
    cursor: pointer;
    border-radius: 10px;
  }

  .col-food .img {
    transition: all 0.3s ease-out;
    border-radius: 15px 15px 0 0;
  }
  .col-food:hover .img {
    opacity: 0.3;
  }
  .col-food:hover {
    background: linear-gradient(
      180deg,
      rgba(173, 81, 156, 1) 64%,
      rgba(98, 79, 198, 1) 100%
    );
  }
  .overlay {
    position: fixed; /* Sit on top of the page content */
    width: 100%; /* Full width (cover the whole page) */
    height: 100%; /* Full height (cover the whole page) */
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 2; /* Specify a stack order in case you're using a different order for other elements */
    cursor: pointer; /* Add a pointer on hover */
  }
</style>
