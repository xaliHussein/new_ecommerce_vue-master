<template>
  <v-col cols="12" sm="12" md="12" lg="12" class="pb-8">
    <v-card class="mx-auto mt-3 card">
      <v-toolbar dark color="#624fc6">
        <v-toolbar-title align-center>اضافة أعدادات جديد</v-toolbar-title>
      </v-toolbar>
      <v-form ref="contact_us">
        <v-card-text class="mt-7">
          <v-row>
            <v-col cols="12" sm="6" md="5" lg="5">
              <v-textarea
                v-model="settings[0].Privacy_policy"
                type="text"
                label="سياسة الخصوصية هنا ...."
                rows="1"
                class="font-weight-black text-field"
                outlined
                reverse
                rounded
                single-line
                :rules="rules"></v-textarea>
            </v-col>

            <v-col cols="12" sm="6" md="5" lg="5">
              <v-textarea
                v-model="settings[0].about_app"
                type="text"
                label="حول التطبيق  ..."
                rows="1"
                class="font-weight-black text-field"
                outlined
                reverse
                rounded
                single-line
                :rules="rules"></v-textarea>
            </v-col>
            <v-col cols="12" sm="6" md="1" lg="1">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="#624fc6"
                    @click="dialog = true"
                    fab
                    v-bind="attrs"
                    v-on="on">
                    <Icon icon="mdi:box-eye" color="white" width="30" />
                  </v-btn>
                </template>
                <span>اضافة تفاصيل </span>
              </v-tooltip>
            </v-col>
            <div v-if="selectedImage" class="overlay">
              <v-img
                class="mt-12"
                :src="server + selectedImage"
                alt=""
                height="95vh"
                contain
                dark
                @click.stop="selectedImage = null">
              </v-img>
            </div>
            <v-col cols="12" sm="6" md="1" lg="1">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <a :href="server + settings[0].logo" id="image">
                    <v-btn
                      class="btn"
                      fab
                      color="white"
                      v-bind="attrs"
                      v-on="on">
                      <Icon
                        icon="fluent:slide-size-24-filled"
                        color="#624FC6"
                        width="32" />
                    </v-btn>
                  </a>
                </template>
                <span>عرض الشعار</span>
              </v-tooltip>
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="4">
              <div id="my-strictly-unique-vue-upload-multiple-image">
                <VueUploadMultipleImage
                  dragText="اضف صوره"
                  browseText=""
                  idUpload="image-upload-setting"
                  idEdit="image-edit-setting"
                  @upload-success="uploadImageSuccess"
                  @before-remove="beforeRemove"
                  @edit-image="editImage"
                  :data-images="images"
                  maxImageSize="5" />
              </div>
              <h3 class="mt-n4 mr-3">اختر الشعار :</h3>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions class="d-flex justify-center pb-5">
          <v-btn
            @click="add_contact_us"
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
    <v-row justify="center">
      <v-dialog v-model="dialog" scrollable max-width="1000px">
        <v-card style="direction: rtl">
          <v-toolbar class="d-flex justify-center" color="#624fc6">
            <h2 style="color: white">اضافة تفاصيل معلومات الموقع</h2>
          </v-toolbar>
          <v-form ref="add_details_contact_us">
            <v-card-title>
              <v-col cols="12" sm="6" md="4" lg="4" class="ma-0">
                <v-text-field
                  v-model="key"
                  :rules="rules"
                  class="font-weight-black text-field"
                  outlined
                  reverse
                  rounded
                  single-line
                  label="اضف عنوان"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4" lg="4" class="ma-0">
                <v-text-field
                  v-model="value"
                  :rules="rules"
                  label="اضف القيمة"
                  class="font-weight-black text-field"
                  outlined
                  reverse
                  rounded
                  single-line></v-text-field
              ></v-col>
              <v-col cols="12" sm="6">
                <v-btn
                  @click="add_details"
                  :loading="loading"
                  color="#624fc6"
                  large
                  rounded
                  class="px-16"
                  elevation="4">
                  <h4 style="color: white; font-size: 17px">اضافة</h4>
                </v-btn>
              </v-col>
            </v-card-title>
          </v-form>
          <v-card-text style="height: 300px; width: 900px" class="mt-3 mx-auto">
            <v-data-table
              :headers="headers"
              :items="settings"
              hide-default-footer
              loading-text="جاري التحميل يرجى الأنتظار"
              class="data_table">
              <template v-slot:item="{ item }">
                <tr v-for="(data, index) in contact_us" :key="index + item.id">
                  <td
                    class="text-center font-weight-black"
                    v-for="(objKey, indexkey) in Object.keys(data)"
                    :key="indexkey">
                    {{ objKey }}
                  </td>
                  <td
                    class="text-center font-weight-black"
                    v-for="(objKey, indexkey) in Object.keys(data)"
                    :key="indexkey + item.id">
                    {{ data[objKey] }}
                  </td>
                  <td class="text-center font-weight-black">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          @click="delete_detail(index)"
                          fab
                          icon
                          x-small
                          v-bind="attrs"
                          v-on="on">
                          <Icon
                            icon="ic:round-delete-forever"
                            color="#C62828"
                            width="32" />
                        </v-btn>
                      </template>
                      <span>حذف </span>
                    </v-tooltip>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-card-text>

          <v-card-actions>
            <v-btn
              outlined
              class="px-4"
              color="#C62828"
              @click="dialog = false">
              <h4>اغلاق</h4>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-col>
</template>
<script>
  export default {
    data() {
      return {
        name: "",
        menu: null,
        selectedImage: null,
        images: [],
        upload: [],
        items: ["اللون", "الحجم"],
        dialog: false,
        contact_us: [],
        input_contact_us: {},
        key: "",
        value: "",
        rules: [(v) => !!v || "اسم الحقل مطلوب"],
        headers: [
          {
            text: " العنوان",
            value: "name",
            class: "secondary white--text title",
            align: "center",
            sortable: false,
          },
          {
            text: "القيمة",
            value: "category",
            class: "secondary white--text title",
            align: "center",
            sortable: false,
          },
          {
            text: "العمليات",
            value: "brand",
            class: "secondary white--text title",
            align: "center",
            sortable: false,
          },
        ],
      };
    },

    computed: {
      settings() {
        return this.$store.state.SettingMoudle.settings;
      },
      loading() {
        return this.$store.state.SettingMoudle.contact_us_lodding;
      },
      server() {
        return this.$store.state.server;
      },
    },
    methods: {
      delete_from_input_contact_us(key, index, value) {
        const prop = key;
        Vue.delete(this.input_contact_us, prop); // delete the property from object
      },
      delete_detail(index) {
        this.contact_us.splice(index, 1);
      },
      toggleFullscreen(image) {
        this.selectedImage = image;
      },

      add_details() {
        if (this.$refs.add_details_contact_us.validate()) {
          let data = {};
          data[this.key] = this.value;
          Object.assign(this.input_contact_us, data);
          this.saveContact_us();
          this.$refs.add_details_contact_us.reset();
        }
      },
      saveContact_us() {
        this.contact_us.push(this.input_contact_us);
        this.input_contact_us = {};
      },
      uploadImageSuccess(formData, index, fileList) {
        this.upload = [];
        fileList.forEach((element) => {
          let img = element.path;
          this.upload.push(img);
        });
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
      add_contact_us() {
        if (this.$refs.contact_us.validate()) {
          let data = {};
          data["Privacy_policy"] = this.settings[0].Privacy_policy;
          data["about_app"] = this.settings[0].about_app;
          data["contact_us"] = this.contact_us;

          if (this.upload[0] != null) {
            data["logo"] = this.upload[0];
          }

          if (this.settings[0] != null) {
            data["id"] = this.settings[0].id;
            this.$store.dispatch("SettingMoudle/editSetting", data);
            this.upload = [];
            this.images = [];
          } else {
            this.$store.dispatch("SettingMoudle/addSetting", data);
            this.upload = [];
            this.images = [];
          }
        }
      },
      reset() {
        this.$refs.form.reset();
        this.$store.state.SettingMoudle.isEdit = false;
      },
      getSettings() {
        this.$store.dispatch("SettingMoudle/getSettings");
      },
    },
    mounted() {
      this.$store.dispatch("SettingMoudle/getSettings");
    },
    watch: {
      settings: function () {
        this.settings.forEach((element) => {
          Object.assign(this.contact_us, JSON.parse(element.contact_us));
        });
      },
    },
  };
</script>
<style scoped>
  .text-field {
    direction: rtl;
  }
  .text-field >>> .error--text {
    text-align: right !important;
  }
</style>
