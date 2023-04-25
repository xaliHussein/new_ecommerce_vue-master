<template>
  <v-col cols="12" sm="12" md="12" lg="12" class="pb-8">
    <v-card class="mx-auto mt-3 card">
      <v-toolbar dark color="#624fc6">
        <v-toolbar-title align-center>اضافة اعلان جديد</v-toolbar-title>
      </v-toolbar>
      <v-form ref="ads">
        <v-card-text class="mt-7">
          <v-row>
            <v-col cols="12" sm="6" md="4" lg="4">
              <v-autocomplete
                v-model="selected_object.type"
                auto-select-first
                item-text="text"
                item-value="value"
                :items="type"
                class="font-weight-black text-field"
                hide-details="auto"
                outlined
                reverse
                rounded
                single-line
                clearable
                label="اختر نوع الأعلان"></v-autocomplete>
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="4">
              <v-text-field
                v-if="selected_object.type == 0 || selected_object.type == null"
                v-model="selected_object.url"
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
                :value="arr">
                <template v-slot:item="{ item }">
                  <v-list-item-content @click.stop="multipleSelection(item)">{{
                    item.name
                  }}</v-list-item-content>
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
                    v-model="selected_object.expaired"
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
                  v-model="selected_object.expaired"
                  @input="menu = false"></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" sm="6" md="3" lg="2" class="mr-2">
              <div
                id="unique-vue-upload-multiple-image"
                style="display: flex; justify-content: center">
                <VueUploadMultipleImage
                  idUpload="image-upload-ads"
                  idEdit="image-edit-ads"
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
        <v-card-actions class="d-flex justify-center mt-2 pb-5">
          <v-btn
            @click="add_ads"
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
  </v-col>
</template>
<script>
  export default {
    data() {
      return {
        name: "",
        menu: null,
        type: [
          { text: "اعلان خارجي", value: 0 },
          { text: "اعلان منتج", value: 1 },
        ],
        arr: [],
        images: [],
        upload: [],
        products_id: [],
        rules: [(v) => !!v || " هذا الحقل مطلوب"],
      };
    },

    computed: {
      products() {
        return this.$store.state.ProductsMoudle.products;
      },
      selected_object() {
        return this.$store.state.AdsMoudle.selected_object;
      },
      loading() {
        return this.$store.state.AdsMoudle.loading_add_ads;
      },
    },
    methods: {
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
      multipleSelection(item) {
        this.arr.push({ ...item });
      },
      deleteChip(index) {
        this.arr.splice(index, 1);
        this.products_id.splice(index, 1);
      },
      add_ads() {
        if (this.$refs.ads.validate()) {
          let data = {};
          data["type"] = this.selected_object.type;
          data["expaired"] = this.selected_object.expaired;
          if (this.upload[0] != null) {
            data["image"] = this.upload[0];
          }
          if (this.selected_object.type == 0) {
            data["url"] = this.selected_object.url;
          } else {
            this.arr.forEach((element) => {
              this.products_id.push(element.id);
            });
            data["products_id"] = this.products_id;
          }
          this.$store.dispatch("AdsMoudle/addAds", data).then(() => {});
          this.$refs.ads.reset();
        }
      },
    },

    created() {
      this.$store.dispatch("ProductsMoudle/getProducts");
    },
  };
</script>
<style>
  .hint {
    font-size: 12px;
    color: #ff0000;
    top: -20px !important;
    position: relative;
  }
  .button_submit {
    position: relative;
    top: -50px !important;
    right: 100px;
  }
  .text-field {
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
</style>
