<template>
  <v-container>
    <v-form ref="form" class="mr-10">
      <v-col cols="12" md="12" lg="12">
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="selected_object.name"
              placeholder="اسم ألماركة "
              label="اسم ألماركة "
              hide-details="auto"
              :rules="rules"
              clearable
            ></v-text-field>
          </v-col>
          <v-col>
            <div
              id="my-strictly-unique-vue-upload-multiple-image"
              style="display: flex; justify-content: center"
            >
              <span class="hint_image">اختر ايقونة للماركة :</span>

              <vue-upload-multiple-image
                @upload-success="uploadImageSuccess"
                @before-remove="beforeRemove"
                @edit-image="editImage"
                :data-images="images"
                maxImageSize="5"
              ></vue-upload-multiple-image>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" align-self="center" class="text-center">
            <v-row justify="center">
              <v-col cols="auto">
                <v-btn secondary color="secondary" @click="validateField">
                  {{ isEdit ? "تعديل القيد" : "أضافة قيد" }}
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
      images: [],
      upload: [],

      rules: [(v) => !!v || "اسم الماركة مطلوب"],
    };
  },
  components: {
    VueUploadMultipleImage,
  },
  computed: {
    selected_object() {
      return this.$store.state.BrandModule.selected_object;
    },
    isEdit() {
      return this.$store.state.BrandModule.isEdit;
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
    validateField() {
      if (this.$refs.form.validate()) {
        let data = {};
        data["name"] = this.selected_object.name;

        if (this.upload[0] != null) {
          data["image"] = this.upload[0];
        }

        if (this.isEdit) {
          data["id"] = this.selected_object.id;
          console.log(data);
          this.editBrand(data);
        } else {
          this.addBrand(data);
        }
      }
    },
    addBrand(data) {
      // let data = {
      //   name: this.name,
      //   icone: this.upload[0],
      // };
      // if (this.category_id != null) {
      //   data["parent_id"] = this.category_id;
      // }

      this.$store.dispatch("BrandModule/addBrand", data);
      this.reset();
    },
    editBrand(data) {
      console.log(data);
      this.$store.dispatch("BrandModule/editBrand", data);
      this.reset();
    },
    reset() {
      this.$refs.form.reset();
      this.images = [];
      this.upload = [];
      this.$store.state.BrandModule.isEdit = false;
    },
  },
};
</script>
<style>
.image-container[data-v-10e59822] {
  width: 161px !important;
  height: 160px !important;
  border: 1px dashed #d6d6d6;
  border-radius: 10px;
  background-color: #fff;
  bottom: 25px !important;
}
</style>
