<template>
  <v-col cols="12" sm="12" md="12" lg="12" class="pb-8" v-if="user_type == 2">
    <v-card class="mx-auto mt-3 card">
      <v-toolbar dark color="#624fc6">
        <v-toolbar-title align-center>اضافة مشرف جديد</v-toolbar-title>
      </v-toolbar>
      <v-form ref="user">
        <v-card-text class="mt-7">
          <v-row>
            <v-col cols="12" sm="6" md="4" lg="4">
              <v-text-field
                v-model="selected_object.user_name"
                label="أسم المستخدم"
                type="text"
                class="font-weight-black text-field"
                outlined
                reverse
                rounded
                single-line
                clearable
                :rules="rules"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="4">
              <v-text-field
                v-model="selected_object.phone_number"
                label="رقم هاتف المستخدم"
                type="number"
                class="font-weight-black text-field"
                outlined
                reverse
                rounded
                single-line
                clearable
                :rules="rules"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="4">
              <v-text-field
                color="#624FC6"
                v-model="selected_object.password"
                outlined
                reverse
                rounded
                single-line
                class="font-weight-black text-field"
                :type="showPassword ? 'text' : 'password'"
                label="كلمة المرور"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
                :rules="PasswordsRules" />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="d-flex justify-center mt-2 pb-5">
          <v-btn
            @click="add_user"
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
        showPassword: false,
        rules: [(v) => !!v || "هذا الحقل مطلوب"],
        PasswordsRules: [
          (value) => !!value || "هذا الحقل مطلوب",
          (value) =>
            (value || "").length >= 6 || "الحد الادنى لعدد الاحرف هوه 6",
        ],
      };
    },

    computed: {
      selected_object() {
        return this.$store.state.UserModule.selected_object;
      },
      loading() {
        return this.$store.state.UserModule.add_user_loading;
      },
      user_type() {
        return localStorage.getItem("user_type");
      },
    },
    methods: {
      add_user() {
        if (this.$refs.user.validate()) {
          let data = {};
          data["user_type"] = 0;
          data["user_name"] = this.selected_object.user_name;
          data["phone_number"] = this.selected_object.phone_number;
          data["password"] = this.selected_object.password;

          this.$store.dispatch("UserModule/addUser", data).then(() => {
            this.$refs.form.reset();
          });
        }
      },
      addUSer(data) {
        this.$store.dispatch("UserModule/addUser", data);
        this.reset();
      },
    },
  };
</script>
<style scoped>
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
  .text-field >>> .error--text {
    text-align: right !important;
  }
</style>
