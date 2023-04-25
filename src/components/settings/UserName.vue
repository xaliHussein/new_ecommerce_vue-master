<template>
  <v-card dir="rtl">
    <v-form ref="change_user_name">
      <v-card-text>
        <v-col cols="12" sm="6" md="5" lg="5">
          <v-text-field
            v-model="full_name"
            color="#624FC6"
            class="font-weight-black text-field"
            hide-details="auto"
            reverse
            outlined
            rounded
            single-line
            clearable
            :rules="userNameRules"
            label="اسم المستخدم" />
        </v-col>
        <v-col cols="12" sm="6" md="5" lg="5">
          <v-text-field
            color="#624FC6"
            v-model="password"
            hide-details="auto"
            outlined
            reverse
            rounded
            single-line
            clearable
            class="font-weight-black text-field"
            :type="showPassword ? 'text' : 'password'"
            label="كلمة المرور"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
            :rules="PasswordsRules" />
        </v-col>
        <v-col cols="12" sm="6" md="5" lg="5" class="d-flex justify-center">
          <v-btn
            @click="change_user_name"
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
        showPassword: false,
        password: "",
        userNameRules: [
          (value) => !!value || "هذا الحقل مطلوب",
          (value) =>
            (value || "").length >= 3 || "الحد الادنى لعدد الاحرف هوه 3",
        ],
        PasswordsRules: [
          (value) => !!value || "هذا الحقل مطلوب",
          (value) =>
            (value || "").length >= 6 || "الحد الادنى لعدد الاحرف هوه 6",
        ],
      };
    },
    computed: {
      full_name: {
        get() {
          return this.$store.state.full_name;
        },
        set(val) {
          return (this.$store.state.full_name = val);
        },
      },
      user_type() {
        return this.$store.state.user_type;
      },
      loading() {
        return this.$store.state.UserModule.edit_admin_loading;
      },
    },
    methods: {
      change_user_name() {
        if (this.$refs.change_user_name.validate()) {
          let data = {};
          data["id"] = this.$store.state.UserModule.id;
          data["user_name"] = this.full_name;
          data["phone_number"] = this.$store.state.UserModule.phone_number;
          data["status"] = this.user_type;
          this.$store
            .dispatch("UserModule/change_info_admin", data)
            .then(() => {
              this.$refs.change_user_name.reset();
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
