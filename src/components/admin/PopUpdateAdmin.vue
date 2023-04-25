<template>
  <v-row justify="center">
    <v-dialog :value="value" max-width="900px" dir="rtl" persistent>
      <v-card class="mx-auto mt-3" style="direction: rtl">
        <v-toolbar dark color="#624fc6" class="d-flex justify-center">
          <v-toolbar-title align-center>تعديل معلومات المشرف </v-toolbar-title>
        </v-toolbar>
        <v-form ref="admin">
          <v-card-text class="mt-7">
            <v-row>
              <v-col cols="12" sm="6" md="6" lg="6">
                <v-text-field
                  v-model="updateAdmin.user_name"
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
              <v-col cols="12" sm="6" md="6" lg="6">
                <v-text-field
                  v-model="updateAdmin.phone_number"
                  label="رقم هاتف المشرف"
                  type="number"
                  class="font-weight-black text-field"
                  outlined
                  reverse
                  rounded
                  single-line
                  clearable
                  :rules="rules"></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="mt-2 pb-5">
            <v-btn
              @click="update_admin"
              :loading="loading"
              color="#624fc6"
              class="px-4 ml-3"
              elevation="4">
              <h4 style="color: white; font-size: 17px">تحديث</h4>
              <template v-slot:loader>
                <span class="custom-loader">
                  <v-icon color="white">mdi-cached</v-icon>
                </span>
              </template>
            </v-btn>
            <v-btn outlined color="#C62828" v-on:click="$emit('popClose')">
              <h4>اغلاق</h4>
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
  export default {
    data() {
      return {
        rules: [(v) => !!v || "هذا الحقل مطلوب"],
      };
    },
    props: {
      value: {
        type: Boolean,
        default: false,
      },
      updateAdmin: {
        type: Object,
      },
    },
    computed: {
      loading() {
        return this.$store.state.UserModule.pop_loading;
      },
    },
    methods: {
      update_admin() {
        if (this.$refs.admin.validate()) {
          let data = {};
          data["id"] = this.updateAdmin.id;
          data["user_name"] = this.updateAdmin.user_name;
          data["phone_number"] = this.updateAdmin.phone_number;
          this.$store.dispatch("UserModule/editUser", data).then(() => {
            this.$emit("popClose");
          });
        }
      },
    },
  };
</script>
<style scoped>
  .text-field {
    direction: ltr;
  }
  #vue-upload-multiple-image {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
</style>
