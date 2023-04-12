<template>
  <v-col cols="12" sm="12" md="12" lg="12" class="pb-8">
    <v-card class="mx-auto mt-3 card">
      <v-toolbar dark color="#624fc6">
        <v-toolbar-title align-center>العلامة التجارية</v-toolbar-title>
      </v-toolbar>
      <v-form ref="form">
        <v-card-text class="mt-7">
          <v-row>
            <v-col cols="12" sm="6" md="6" lg="6">
              <v-text-field
                v-model="selected_object.name"
                type="text"
                label="اسم العلامة التجارية "
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
                  idUpload="image-upload-Brand"
                  idEdit="image-edit-Brand"
                  @upload-success="uploadImageSuccess"
                  @before-remove="beforeRemove"
                  @edit-image="editImage"
                  :data-images="images"
                  dragText="اضف صور"
                  browseText=""
                  maxImageSize="5" />
              </div>
              <h3 class="text-center mt-n4">اختر ايقونة العلامة التجاريه :</h3>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="d-flex justify-center mt-2 pb-5">
          <v-btn
            @click="addBrand"
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
        images: [],
        upload: [],

        rules: [(v) => !!v || "اسم الماركة مطلوب"],
      };
    },

    computed: {
      selected_object() {
        return this.$store.state.BrandModule.selected_object;
      },
      loading() {
        return this.$store.state.BrandModule.loading_add_brand;
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
      addBrand() {
        if (this.$refs.form.validate()) {
          let data = {};
          data["name"] = this.selected_object.name;

          if (this.upload[0] != null) {
            data["image"] = this.upload[0];
          }

          this.$store.dispatch("BrandModule/addBrand", data).then(() => {
            this.$refs.form.reset();
            this.images = [];
            this.upload = [];
          });
        }
      },

      editBrand(data) {
        console.log(data);
        this.$store.dispatch("BrandModule/editBrand", data);
        this.reset();
      },
    },
  };
</script>
<style>
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
  .image-container[data-v-10e59822] {
    width: 161px !important;
    height: 160px !important;
    border: 1px dashed #d6d6d6;
    border-radius: 10px;
    background-color: #fff;
    bottom: 25px !important;
  }
</style>
