<template>
  <v-row justify="center">
    <v-dialog :value="dialogEdit" max-width="900px" dir="rtl" persistent>
      <v-card class="mx-auto mt-3" style="direction: rtl">
        <v-toolbar dark color="#624fc6" class="d-flex justify-center">
          <v-toolbar-title align-center>تعديل قسم </v-toolbar-title>
        </v-toolbar>
        <v-form ref="update_category">
          <v-card-text class="mt-7">
            <v-row>
              <v-col cols="12" sm="6" md="6" lg="6">
                <v-text-field
                  v-model="updateCategory.name"
                  type="text"
                  label="اسم القسم "
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
                  id="my-strictly-unique-vue-upload-multiple-image"
                  style="display: flex; justify-content: center">
                  <VueUploadMultipleImage
                    :idUpload="'image-upload-category' + updateCategory.id"
                    :idEdit="'image-edit-category' + updateCategory.id"
                    @upload-success="uploadImageSuccess"
                    @before-remove="Remove"
                    :data-images="images_edit"
                    maxImageSize="5"
                    dragText="اضف صورة"
                    browseText="" />
                </div>
                <h3 class="text-center mt-n4">اختر ايقونة القسم :</h3>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="mt-2 pb-5">
            <v-btn
              @click="update_category"
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
        upload_img_edit: [],
        images_edit: [],
        rules: [(v) => !!v || "هذا الحقل مطلوب"],
      };
    },
    props: {
      dialogEdit: {
        type: Boolean,
        default: false,
      },
      updateCategory: {
        type: Object,
        default: null,
      },
    },
    computed: {
      loading() {
        return this.$store.state.CategoryModule.pop_loading;
      },
    },
    methods: {
      update_category() {
        if (this.$refs.update_category.validate()) {
          let data = {};
          data["id"] = this.updateCategory.id;
          data["name"] = this.updateCategory.name;
          if (this.upload_img_edit[0] != null) {
            data["icone"] = this.upload_img_edit[0];
          }
          this.$store.dispatch("CategoryModule/editCategory", data).then(() => {
            this.$emit("popClose");
          });
        }
      },
      uploadImageSuccess(formData, index, fileList) {
        this.upload_img_edit = [];
        fileList.forEach((element) => {
          let image = element.path;
          this.upload_img_edit.push(image);
        });
      },
      Remove(index, done, fileList) {
        var r = confirm("سوف يتم حذف الصورة");
        if (r == true) {
          done();
          this.upload_img_edit.splice(index, 1);
        }
      },
    },
  };
</script>
<style scoped>
  .text-field {
    direction: ltr;
  }
</style>
