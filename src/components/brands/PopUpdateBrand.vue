<template>
  <v-row justify="center">
    <v-dialog :value="value" max-width="900px" dir="rtl" persistent>
      <v-card class="mx-auto mt-3" style="direction: rtl">
        <v-toolbar dark color="#624fc6" class="d-flex justify-center">
          <v-toolbar-title align-center>تعديل قسم </v-toolbar-title>
        </v-toolbar>
        <v-form ref="update_brand">
          <v-card-text class="mt-7">
            <v-row>
              <v-col cols="12" sm="6" md="6" lg="6">
                <v-text-field
                  v-model="updateBrand.name"
                  type="text"
                  label="اسم الماركة "
                  hide-details="auto"
                  class="font-weight-black text-field"
                  outlined
                  reverse
                  rounded
                  single-line
                  clearable
                  :rules="rules"></v-text-field>
              </v-col>

              <v-col cols="12" sm="4">
                <div
                  id="unique-vue-upload-multiple-image"
                  style="display: flex; justify-content: center">
                  <VueUploadMultipleImage
                    :idUpload="'image-upload-brand' + updateBrand.id"
                    :idEdit="'image-edit-brand' + updateBrand.id"
                    @upload-success="uploadImageSuccess"
                    @before-remove="beforeRemove"
                    @edit-image="editImage"
                    :data-images="images"
                    maxImageSize="5" />
                </div>

                <h3 class="text-center mt-n4">
                  اختر ايقونة العلامة التجارية :
                </h3>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="mt-2 pb-5">
            <v-btn
              @click="update_brand"
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
        images1: [],
        upload_img_edit: [],
        // upload_img_edit: [],
        // images_edit: [],
        rules: [(v) => !!v || "هذا الحقل مطلوب"],
      };
    },
    props: {
      value: {
        type: Boolean,
        default: false,
      },
      updateBrand: {
        type: Object,
        default: null,
      },
    },
    computed: {
      loading() {
        return this.$store.state.BrandModule.pop_loading;
      },
    },
    methods: {
      update_brand() {
        if (this.$refs.update_brand.validate()) {
          let data = {};
          data["id"] = this.updateBrand.id;
          data["name"] = this.updateBrand.name;
          if (this.upload_img_edit[0] != null) {
            data["image"] = this.upload_img_edit[0];
          }
          this.$store.dispatch("BrandModule/editBrand", data).then(() => {
            this.$emit("popClose");
          });
        }
      },
      // upload(formData, index, fileList) {
      //   console.log("data", formData, index, fileList);
      //   this.upload_img_edit = [];
      //   fileList.forEach((element) => {
      //     let image = element.path;
      //     this.upload_img_edit.push(image);
      //     console.log(this.upload_img_edit);
      //   });
      // },
      // editImage(formData, index, fileList) {
      //   console.log("edit data", formData, index, fileList);
      // },
      // Remove(index, done, fileList) {
      //   console.log("index", index, fileList);
      //   var r = confirm("remove image");
      //   if (r == true) {
      //     done();
      //   }
      // },
      uploadImageSuccess1(formData, index, fileList) {
        this.upload_img_edit = [];
        fileList.forEach((element) => {
          let img = element.path;
          this.upload_img_edit.push(img);
        });
        console.log(fileList);
      },
      beforeRemove1(index, done, fileList) {
        console.log("index", index, fileList);
        var r = confirm("remove image");
        if (r == true) {
          done();
        }
      },
      editImage1(formData, index, fileList) {
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
