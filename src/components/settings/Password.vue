<template>
  <v-card dir="rtl" class="mx-auto">
    <v-form ref="update_password">
      <v-card-text>
        <v-col cols="12" sm="10" md="6" lg="5">
          <v-text-field
            v-model="old_password"
            color="#624FC6"
            class="font-weight-black text-field"
            hide-details="auto"
            reverse
            outlined
            rounded
            single-line
            clearable
            :rules="userNameRules"
            label="كلمة المرور القديمة" />
        </v-col>
        <v-col cols="12" sm="10" md="6" lg="5">
          <v-text-field
            color="#624FC6"
            v-model="new_password"
            hide-details="auto"
            outlined
            reverse
            rounded
            single-line
            clearable
            class="font-weight-black text-field"
            :type="showPassword ? 'text' : 'password'"
            label="كلمة المرور الجديدة"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
            :rules="PasswordsRules" />
        </v-col>
        <v-col cols="12" sm="10" md="6" lg="5">
          <v-text-field
            color="#624FC6"
            v-model="confirm_new_password"
            hide-details="auto"
            outlined
            reverse
            rounded
            single-line
            clearable
            class="font-weight-black text-field"
            :type="showPassword2 ? 'text' : 'password'"
            label="تاكيد كلمة المرور"
            :append-icon="showPassword2 ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword2 = !showPassword2"
            :rules="confirmPasswordRules" />
        </v-col>
        <v-col cols="12" sm="8" md="5" lg="5" class="d-flex justify-center">
          <v-btn
            @click="update_password"
            :loading="loading"
            color="#624fc6"
            large
            rounded
            class="px-6"
            elevation="4">
            <h4 style="color: white; font-size: 17px">حفظ</h4>
            <template v-slot:loader>
              <span class="custom-loader">
                <v-icon color="white">mdi-cached</v-icon>
              </span>
            </template>
          </v-btn>
        </v-col>
      </v-card-text>
    </v-form>
  </v-card>
</template>
<script>
  export default {
    data() {
      return {
        old_password: "",
        new_password: "",
        confirm_new_password: "",
        showPassword: false,
        showPassword2: false,
        userNameRules: [
          (value) => !!value || "هذا الحقل مطلوب",
          (value) =>
            (value || "").length >= 6 || "الحد الادنى لعدد الاحرف هوه 6",
        ],
        PasswordsRules: [
          (value) => !!value || "هذا الحقل مطلوب",
          (value) =>
            (value || "").length >= 6 || "الحد الادنى لعدد الاحرف هوه 6",
        ],
        confirmPasswordRules: [
          (value) => !!value || "هذا الحقل مطلوب",
          (value) =>
            (value || "").length >= 6 || "الحد الادنى لعدد الاحرف هوه 6",
          (value) =>
            (value || "") == this.new_password || "كلمة المرور غير متطابقه",
        ],
      };
    },
    computed: {
      loading() {
        return this.$store.state.UserModule.edit_admin_loading;
      },
    },
    methods: {
      update_password() {
        if (this.$refs.update_password.validate()) {
          let data = {};
          data["id"] = this.$store.state.UserModule.id;
          data["cureent_password"] = this.old_password;
          data["new_password"] = this.new_password;
          this.$store.dispatch("UserModule/update_password", data).then(() => {
            this.$refs.update_password.reset();
          });
        }
      },
    },
  };
</script>
<style scoped>
  .text-field >>> .error--text {
    text-align: right !important;
  }
</style>
