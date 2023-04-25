<template>
  <v-container class="login" fluid>
    <v-row class="justify-center">
      <v-col cols="12">
        <v-form ref="form">
          <v-card class="card" width="1000">
            <v-row class="justify-center">
              <v-col
                cols="12"
                sm="12"
                md="6"
                lg="6"
                class="d-flex justify-center">
                <v-img
                  class="img ml-6"
                  src="../assets/dashboard_login.jpg"></v-img>
              </v-col>
              <v-col cols="12" sm="12" md="6" lg="6" class="justify-center">
                <v-card-title class="d-flex justify-center mt-6">
                  <h2>اهلا بك في لوحة التحكم</h2>
                </v-card-title>
                <v-card-text class="mt-2">
                  <v-text-field
                    v-model="phone_number"
                    color="#624FC6"
                    class="font-weight-black text-field"
                    reverse
                    outlined
                    rounded
                    single-line
                    :rules="userNameRules"
                    clearable
                    label="اسم المستخدم او رقم الهاتف " />

                  <v-text-field
                    color="#624FC6"
                    v-model="password"
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
                </v-card-text>

                <v-card-actions>
                  <v-btn
                    @click="login"
                    :loading="loading_login"
                    color="#ad519c"
                    large
                    rounded
                    class="px-16 mx-auto"
                    elevation="4">
                    <h4 style="color: white; font-size: 17px">تسجيل الدخول</h4>
                    <template v-slot:loader>
                      <span class="custom-loader">
                        <v-icon color="white">mdi-cached</v-icon>
                      </span>
                    </template>
                  </v-btn>
                </v-card-actions>
              </v-col>
            </v-row>
          </v-card>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
  export default {
    data() {
      return {
        phone_number: null,
        password: null,
        showPassword: false,
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
      loading_login() {
        return this.$store.state.loading_login;
      },
    },
    methods: {
      login() {
        if (this.$refs.form.validate()) {
          let data = {};
          data["phone_number"] = this.phone_number;
          data["password"] = this.password;
          this.$store.dispatch("login", data).then(() => {
            this.$router.push("/");
            location.reload();
          });
        }
      },
    },
  };
</script>

<style scoped>
  .card {
    margin-top: 60px !important;
    direction: ltr !important;
    margin: auto;
    border-radius: 15px;
    /* border: solid 1px #ad519c; */
    box-shadow: 0px 0px !important;
  }
  .img {
    border-radius: 15px;
  }

  .link-h4 {
    cursor: pointer;
  }
  .link-h4:hover {
    text-decoration: underline;
    color: darkblue;
  }
  .text-field >>> .error--text {
    text-align: right !important;
  }
  .login {
    background-color: #624fc6;
    height: 100%;
  }
</style>
