<template>
  <v-row justify="center">
    <v-dialog :value="value" persistent max-width="390">
      <v-card class="mx-auto mt-3 card">
        <v-toolbar dark color="#624fc6">
          <v-toolbar-title align-center>اضافة قسم جديد</v-toolbar-title>
        </v-toolbar>
        <v-form ref="form">
          <v-card-text class="mt-7">
            <v-row>
              <v-col cols="12" sm="6" md="6" lg="6">
                <v-text-field
                  v-model="selected_object.name"
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
                  <vue-upload-multiple-image
                    @upload-success="uploadImageSuccess"
                    @before-remove="beforeRemove"
                    @edit-image="editImage"
                    :data-images="images"
                    maxImageSize="5"></vue-upload-multiple-image>
                </div>
                <h3 class="text-center mt-n4">اختر ايقونة للقسم :</h3>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="d-flex justify-center mt-2 pb-5">
            <v-btn
              @click="addCategory"
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
    </v-dialog>
  </v-row>
</template>
<script>
  import VueUploadMultipleImage from "vue-upload-multiple-image";
  export default {
    components: {
      VueUploadMultipleImage,
    },
    props: {
      value: {
        type: Boolean,
        default: false,
      },
      updateCategory: {
        type: Object,
      },
    },
    computed: {
      loading() {
        return this.$store.state.ProductsMoudle.pop_loading;
      },
    },
    methods: {
      update_category() {
        // CategoryModule/editCategory
      },
      uploadImageSuccess(formData, index, fileList) {
        this.upload = [];
        fileList.forEach((element) => {
          let img = element.path;
          this.upload.push(img);
        });
      },
      beforeRemove(index, done, fileList) {
        console.log("index", index, fileList);
        var r = confirm("remove image");
        if (r == true) {
          done();
        }
      },
    },
  };
</script>
