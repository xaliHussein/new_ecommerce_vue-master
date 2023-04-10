<template>
  <v-container>
    <v-form ref="form" class="mr-10">
      <v-col cols="12" md="12" lg="12">
        <v-row>
          <v-col cols="12" sm="4">
            <v-autocomplete
              :disabled="isUpdate"
              auto-select-first
              clearable
              :items="type"
              v-model="selected_object.type"
              item-text="text"
              item-value="value"
              label="اختر نوع الأعلان"></v-autocomplete>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-if="selected_object.type == 0 || selected_object.type == null"
              v-model="selected_object.url"
              placeholder="عنوان الموقع "
              label="عنوان الموقع "
              hide-details="auto"
              :rules="rules"
              clearable></v-text-field>
            <v-combobox
              v-else
              :items="products"
              label="اختر المنتجات"
              multiple
              small-chips
              deletable-chips
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

          <v-col cols="12" sm="4">
            <v-menu
              v-model="menu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  clearable
                  v-model="selected_object.expaired"
                  label="تأريخ انتهاء الخصم "
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  hint="يجب ادخال تأريخ انتهاء الخصم بعد تأريخ اليوم"></v-text-field>
                <span class="hint"
                  ># يجب ادخال تأريخ انتهاء الخصم بعد تأريخ اليوم</span
                >
              </template>
              <v-date-picker
                v-model="selected_object.expaired"
                @input="menu = false"></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <div
              id="my-strictly-unique-vue-upload-multiple-image"
              style="display: flex; justify-content: center">
              <span class="hint_image">اختر صورة الأعلان :</span>
              <vue-upload-multiple-image
                idUpload="image-upload-ads"
                idEdit="image-edit-ads"
                @upload-success="uploadImageSuccess"
                @before-remove="beforeRemove"
                @edit-image="editImage"
                :data-images="images"
                maxImageSize="5"></vue-upload-multiple-image>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-row justify="center">
              <v-col cols="auto">
                <v-btn secondary color="secondary" @click="validateField">
                  {{ isUpdate ? "تعديل القيد" : "أضافة قيد" }}
                </v-btn>
              </v-col>
              <v-col cols="auto">
                <v-btn secondary color="secondary" @click="reset">
                  تصفير الحقول
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-form>
  </v-container>
</template>
<script>
  import VueUploadMultipleImage from "vue-upload-multiple-image";

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
        isUpdate: false,
        rules: [(v) => !!v || "اسم الماركة مطلوب"],
      };
    },
    components: {
      VueUploadMultipleImage,
    },
    computed: {
      products() {
        return this.$store.state.ProductsMoudle.products;
      },
      selected_object() {
        return this.$store.state.AdsMoudle.selected_object;
      },
      isEdit() {
        return this.$store.state.AdsMoudle.isEdit;
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
        console.log("index", index, fileList);
        var r = confirm("remove image");
        if (r == true) {
          done();
        }
      },
      editImage(formData, index, fileList) {
        console.log("edit data", formData, index, fileList);
      },
      multipleSelection(item) {
        this.arr.push({ ...item });
        console.log(this.arr);
      },
      deleteChip(index) {
        this.arr.splice(index, 1);
        this.products_id.splice(index, 1);
      },
      validateField() {
        if (this.$refs.form.validate()) {
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
          console.log(data);

          if (this.isUpdate) {
            data["id"] = this.selected_object.id;
            this.editAds(data);
          } else {
            this.addAds(data);
          }
        }
      },
      addAds(data) {
        this.$store.dispatch("AdsMoudle/addAds", data);
        this.reset();
      },
      editAds(data) {
        console.log(data);
        this.$store.dispatch("AdsMoudle/editAds", data);
        this.reset();
      },
      reset() {
        this.$refs.form.reset();
        this.arr = [];
        this.products_id = [];
        this.upload = [];
        this.images = [];
        this.isUpdate = false;
        this.$store.state.ProductsMoudle.isEdit = false;
      },
    },

    created() {
      this.$store.dispatch("ProductsMoudle/getProducts");
    },
    watch: {
      isEdit() {
        console.log(this.isEdit);
        if (this.isEdit) {
          console.log(this.selected_object);
          if (this.selected_object.type == 1) {
            this.arr = [];
            this.selected_object.products.forEach((element) => {
              this.arr.push({ ...element });
            });
          }
        }
        this.$store.state.AdsMoudle.isEdit = false;
        this.isUpdate = true;
      },
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
</style>
