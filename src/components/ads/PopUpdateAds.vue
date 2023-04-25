<template>
  <v-row justify="center">
    <v-dialog :value="value" max-width="900px" dir="rtl" persistent>
      <v-card class="mx-auto mt-3" style="direction: rtl">
        <v-toolbar dark color="#624fc6" class="d-flex justify-center">
          <v-toolbar-title align-center>تعديل الاعلان </v-toolbar-title>
        </v-toolbar>
        <v-form ref="ads">
          <v-card-text class="mt-7">
            <v-row>
              <v-col cols="12" sm="6" md="4" lg="4">
                <v-text-field
                  v-if="updateAds.type == 0 || updateAds.type == null"
                  v-model="updateAds.url"
                  type="text"
                  label="عنوان الموقع "
                  class="font-weight-black text-field"
                  outlined
                  reverse
                  rounded
                  single-line
                  clearable
                  :rules="rules"></v-text-field>

                <v-combobox
                  v-else
                  :items="products"
                  label="اختر المنتجات"
                  class="font-weight-black text-field"
                  multiple
                  small-chips
                  deletable-chips
                  outlined
                  reverse
                  rounded
                  single-line
                  clearable
                  :rules="rules"
                  :value="updateAds.products">
                  <template v-slot:item="{ item }">
                    <v-list-item-content
                      @click.stop="multipleSelection(item)"
                      >{{ item.name }}</v-list-item-content
                    >
                  </template>
                  <template v-slot:selection="{ item, index }">
                    <v-chip
                      close
                      secondary
                      color="info"
                      @click:close="deleteChip(index)"
                      >{{ item.name }}</v-chip
                    >
                  </template>
                </v-combobox>
              </v-col>
              <v-col cols="12" sm="6" md="4" lg="4">
                <v-menu
                  v-model="menu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="updateAds.expaired"
                      type="text"
                      label="تأريخ انتهاء الاعلان "
                      hide-details="auto"
                      class="font-weight-black text-field"
                      outlined
                      reverse
                      rounded
                      single-line
                      clearable
                      :rules="rules"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      persistent-hint
                      hint="يجب ادخال تأريخ انتهاء الاعلان بعد تأريخ اليوم"></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="updateAds.expaired"
                    @input="menu = false"></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" sm="6" md="3" lg="2" class="mr-2">
                <div
                  id="unique-vue-upload-multiple-image"
                  style="display: flex; justify-content: center">
                  <VueUploadMultipleImage
                    :idUpload="'image-upload-ads' + updateAds.id"
                    :idEdit="'image-edit-ads' + updateAds.id"
                    @upload-success="uploadImageSuccess"
                    @before-remove="beforeRemove"
                    @edit-image="editImage"
                    :data-images="images"
                    dragText="اضف صور"
                    browseText=""
                    maxImageSize="5" />
                </div>
                <h3 class="text-center mt-n4">اختر صورة الأعلان :</h3>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="mt-2 pb-5">
            <v-btn
              @click="update_ads"
              :loading="loading"
              color="#624fc6"
              class="px-4 ml-3"
              elevation="4">
              <h4 style="color: white; font-size: 17px">تحديث</h4>
              <template v-slot:loader>
                <span class="custom-loader">
                  <v-icon color="white">mdi-cached</v-icon>
                </span>
              </template>
            </v-btn>
            <v-btn outlined color="#C62828" v-on:click="$emit('popClose')">
              <h4>اغلاق</h4>
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
  export default {
    data() {
      return {
        images: [],
        upload: [],
        products_id: [],

        menu: null,
        rules: [(v) => !!v || "هذا الحقل مطلوب"],
      };
    },
    props: {
      value: {
        type: Boolean,
        default: false,
      },
      updateAds: {
        type: Object,
      },
      products: {
        type: Array,
      },
    },
    computed: {
      loading() {
        return this.$store.state.AdsMoudle.pop_loading;
      },
    },
    methods: {
      multipleSelection(item) {
        this.updateAds.products.push({ ...item });
        console.log(this.updateAds.products);
      },
      deleteChip(index) {
        this.updateAds.products.splice(index, 1);
        this.products_id.splice(index, 1);
      },
      update_ads() {
        if (this.$refs.ads.validate()) {
          let data = {};
          data["id"] = this.updateAds.id;
          data["type"] = this.updateAds.type;
          data["expaired"] = this.updateAds.expaired;
          if (this.upload[0] != null) {
            data["image"] = this.upload[0];
          }
          if (this.updateAds.type == 0) {
            data["url"] = this.updateAds.url;
          } else {
            this.updateAds.products.forEach((element) => {
              this.products_id.push(element.id);
            });
            data["products_id"] = this.products_id;
          }

          this.$store.dispatch("AdsMoudle/editAds", data).then(() => {
            this.upload = [];
            this.$emit("popClose");
          });
        }
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
  #vue-upload-multiple-image {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
</style>
