<template>
  <v-container>
    <template>
      <v-row justify="center">
        <v-dialog v-model="dialog" scrollable max-width="1000px">
          <v-card>
            <v-card-title>التفاصيل </v-card-title>
            <v-divider></v-divider>
            <v-card-text
              style="height: 1000px; width: 900px"
              class="mt-3 mr-10"
            >
              <table id="customers">
                <tr>
                  <th>التفاصيل</th>
                  <th>القيمة</th>
                  <th>الحذف</th>
                </tr>
                <tr
                  v-for="(value, key, index) in input_contact_us"
                  :key="index"
                >
                  <th>{{ key }}</th>
                  <th>{{ value }}</th>
                  <th>
                    <v-btn
                      color="red"
                      icon
                      dark
                      @click="delete_from_input_contact_us(key, index, value)"
                    >
                      <i class="fa fa-close fa-lg" aria-hidden="true"></i>
                    </v-btn>
                  </th>
                </tr>
              </table>
              <template>
                <v-divider></v-divider>
                <span class="hint_advance"><b>التفاصيل المحجوزة</b> </span>
                <table class="mt-5" id="customers">
                  <tr>
                    <th>التفاصيل المحجوزة</th>

                    <th>الحذف</th>
                  </tr>
                  <tr v-for="(data, index) in contact_us" :key="index">
                    <th>
                      <span
                        v-for="(objKey, indexkey) in Object.keys(data)"
                        :key="indexkey"
                      >
                        {{ objKey }} =>{{ data[objKey] }} <br
                      /></span>
                    </th>

                    <th>
                      <v-btn
                        color="red"
                        icon
                        dark
                        @click="delete_detail(index)"
                      >
                        <i class="fa fa-close fa-lg" aria-hidden="true"></i>
                      </v-btn>
                    </th>
                  </tr>
                </table>
              </template>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions dir="ltr">
              <v-btn
                class="primary"
                color="white darken-1"
                text
                dark
                @click="dialog = false"
              >
                غلق
              </v-btn>
              <v-btn
                class="primary ml-2"
                color="white darken-1"
                text
                :disabled="
                  Object.keys(input_contact_us).length > 0 ? false : true
                "
                dark
                @click="saveContact_us"
              >
                حفظ
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template>

    <v-form ref="form" class="mr-10 mt-10">
      <v-col cols="12" md="12" lg="12">
        <v-row>
          <v-col cols="12" sm="4">
            <v-textarea
              class="mx-2"
              label="ادخل  سياسة الخصوصية هنا ...."
              rows="2"
              v-model="selected_object.Privacy_policy"
            ></v-textarea>
          </v-col>
          <v-col cols="12" sm="4">
            <v-textarea
              class="mx-2"
              label="ادخل حول التطبيق هنا ...."
              rows="2"
              v-model="selected_object.about_app"
            ></v-textarea>
          </v-col>
          <v-col cols="12" sm="4">
            <div
              id="my-strictly-unique-vue-upload-multiple-image"
              style="display: flex; justify-content: center"
            >
              <span class="hint_image">اختر اللوكو :</span>
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
        <h2>أضف الكونتاكت اس</h2>
        <v-row class="mt-10">
          <v-col cols="12" sm="3">
            <v-text-field
              v-model="key"
              placeholder="اضف عنوان"
              label="اضف عنوان"
              hide-details="auto"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="3">
            <v-text-field
              v-model="value"
              placeholder="اضف القيمة"
              label="اضف القيمة"
              hide-details="auto"
              clearable
            ></v-text-field
          ></v-col>
          <v-col cols="12" sm="1">
            <v-btn
              @click="add_details"
              class="d-flex mx-2"
              fab
              dark
              color="secondary"
            >
              <i class="fa fa-plus fa-lg" aria-hidden="true"></i>
            </v-btn>
          </v-col>
          <v-col cols="12" sm="1">
            <v-btn fab color="secondary" @click="dialog = true">
              <i class="fa fa-eye fa-lg" aria-hidden="true"></i>
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <!-- class="button_submit" -->
          <v-col cols="12" sm="2">
            <v-row justify="center">
              <v-col cols="auto">
                <v-btn secondary color="secondary" @click="validateField">
                  {{ settings.length > 0 ? "تعديل القيد" : "أضافة قيد" }}
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
      images: [],
      upload: [],
      items: ["اللون", "الحجم"],
      dialog: false,
      contact_us: [],

      input_contact_us: {},
      key: "",
      value: "",
      rules: [(v) => !!v || "اسم الماركة مطلوب"],
    };
  },
  components: {
    VueUploadMultipleImage,
  },
  computed: {
    settings() {
      return this.$store.state.SettingMoudle.settings;
    },
    selected_object() {
      return this.$store.state.SettingMoudle.selected_object;
    },
    isEdit() {
      return this.$store.state.SettingMoudle.isEdit;
    },
  },
  methods: {
    delete_from_input_contact_us(key, index, value) {
      const prop = key;
      console.log(this.test);
      Vue.delete(this.input_contact_us, prop); // delete the property from object
      console.log(this.input_contact_us);
    },
    delete_detail(index) {
      this.contact_us.splice(index, 1);
      console.log(index);
    },
    add_details() {
      let data = {};
      data[this.key] = this.value;
      Object.assign(this.input_contact_us, data);
      console.log(this.input_contact_us);

      this.key = "";
      this.value = "";
    },
    saveContact_us() {
      this.contact_us.push(this.input_contact_us);
      this.input_contact_us = {};
      this.dialog = false;
      console.log(this.contact_us);
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
        data["Privacy_policy"] = this.selected_object.Privacy_policy;
        data["about_app"] = this.selected_object.about_app;
        data["contact_us"] = this.contact_us;

        if (this.upload[0] != null) {
          data["logo"] = this.upload[0];
        }
        console.log(data);
        if (this.settings.length > 0) {
          data["id"] = this.selected_object.id;
          this.editSetting(data);
        } else {
          this.addSetting(data);
        }
      }
    },
    addSetting(data) {
      console.log(data);
      this.$store.dispatch("SettingMoudle/addSetting", data);
      this.reset();
    },
    editSetting(data) {
      console.log(data);
      this.$store.dispatch("SettingMoudle/editSetting", data);
      this.reset();
    },
    reset() {
      this.$refs.form.reset();
      this.$store.state.SettingMoudle.isEdit = false;
    },
    getSettings() {
      this.$store.dispatch("SettingMoudle/getSettings");
    },
  },
  created() {
    this.$store.dispatch("SettingMoudle/resetFields");
    this.$store.dispatch("SettingMoudle/getSettings");
  },
  watch: {
    settings: function () {
      this.settings.forEach((element) => {
        this.selected_object.Privacy_policy = element.Privacy_policy;
        this.selected_object.about_app = element.about_app;
        Object.assign(this.contact_us, JSON.parse(element.contact_us));
      });
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
