<template>
  <v-col cols="12" sm="12" md="12" lg="12" class="pb-8">
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
  </v-col>
</template>
<script>
  import VueUploadMultipleImage from "vue-upload-multiple-image";

  export default {
    data() {
      return {
        name: "",
        images: [],
        upload: [],
        category_id: null,
        rules: [(value) => !!value || "هذا الحقل مطلوب"],
      };
    },
    components: {
      VueUploadMultipleImage,
    },
    computed: {
      loading() {
        return this.$store.state.CategoryModule.loading_add_Category;
      },
      categories() {
        return this.$store.state.CategoryModule.categories;
      },
      selected_object() {
        return this.$store.state.CategoryModule.selected_object;
      },
      isEdit() {
        return this.$store.state.CategoryModule.isEdit;
      },
    },
    methods: {
      getCategories() {
        this.$store.dispatch("CategoryModule/getCategories");
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

      addCategory() {
        if (this.$refs.form.validate()) {
          let data = {};
          data["name"] = this.selected_object.name;
          data["icone"] = this.upload[0];
          this.$store.dispatch("CategoryModule/addCategory", data);
          this.reset();
        }
      },

      // editCategory(data) {
      //   this.$store.dispatch("CategoryModule/editCategory", data);
      //   this.reset();
      // },
      reset() {
        this.$refs.form.reset();
        this.images = [];
        this.upload = [];
        this.$store.state.CategoryModule.isEdit = false;
      },
    },
    created() {
      this.getCategories();
    },
  };
</script>
<style scoped>
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
    height: 168px !important;
    border: 1px dashed #d6d6d6;
    border-radius: 10px;
    background-color: #fff;
  }
</style>
