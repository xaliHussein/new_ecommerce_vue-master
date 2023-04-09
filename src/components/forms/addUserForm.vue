<template>
  <v-container>
    <v-form ref="form" class="mr-10">
      <v-col cols="12" md="12" lg="12">
        <v-row>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="selected_object.user_name"
              placeholder="أسم المستخدم"
              label="أسم المستخدم"
              hide-details="auto"
              :rules="rules"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="selected_object.phone_number"
              placeholder="رقم هاتف المستخدم"
              label="رقم هاتف المستخدم"
              hide-details="auto"
              :rules="rules"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              :disabled="isEdit"
              v-model="selected_object.password"
              placeholder="كلمة المرور"
              label="كلمة المرور"
              hide-details="auto"
              clearable
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
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
      isUpdate: false,
      rules: [(v) => !!v || "هذا الحقل مطلوب"],
    };
  },
  components: {
    VueUploadMultipleImage,
  },
  computed: {
    selected_object() {
      return this.$store.state.UserModule.selected_object;
    },
    isEdit() {
      return this.$store.state.UserModule.isEdit;
    },
  },
  methods: {
    validateField() {
      if (this.$refs.form.validate()) {
        let data = {};
        data["user_type"] = 0;
        data["user_name"] = this.selected_object.user_name;
        data["phone_number"] = this.selected_object.phone_number;

        // if (this.upload[0] != null) {
        //   data["image"] = this.upload[0];
        // }
        console.log(data);
        // return;
        if (this.isEdit) {
          data["id"] = this.selected_object.id;
          this.editUser(data);
          this.reset();
        } else {
          data["password"] = this.selected_object.password;
          this.addUSer(data);
          this.reset();
        }
        // location.reload();
      }
    },
    addUSer(data) {
      this.$store.dispatch("UserModule/addUser", data);
      this.reset();
    },
    editUser(data) {
      console.log(data);
      this.$store.dispatch("UserModule/editUser", data);
      this.reset();
    },
    reset() {
      this.$refs.form.reset();
      this.user_name = "";
      this.phone_number = "";
      this.password = "";
      this.$store.state.UserModule.isEdit = false;
    },
  },

  created() {
    this.$store.dispatch("ProductsMoudle/getProducts");
  },
  watch: {},
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
