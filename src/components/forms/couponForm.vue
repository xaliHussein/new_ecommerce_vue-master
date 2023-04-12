<template>
  <v-col cols="12" sm="12" md="12" lg="12" class="pb-8">
    <v-card class="mx-auto mt-3 card">
      <v-toolbar dark color="#624fc6">
        <v-toolbar-title align-center>اضافة خصم جديد</v-toolbar-title>
      </v-toolbar>
      <v-form ref="form">
        <v-card-text class="mt-7">
          <v-row>
            <v-col cols="12" sm="6" md="4" lg="4">
              <v-text-field
                v-model="selected_object.coupon_code"
                type="text"
                label="كود الخصم "
                hide-details="auto"
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
                v-model="selected_object.coupon_ratio"
                type="text"
                label="قيمة الخصم"
                hide-details="auto"
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
                v-model="selected_object.max_users"
                type="text"
                label="اقصى عدد مستخدمين"
                hide-details="auto"
                class="font-weight-black text-field"
                outlined
                reverse
                rounded
                single-line
                clearable
                :rules="rules"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6" md="4" lg="4">
              <v-menu
                v-model="menu"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="selected_object.expaired"
                    type="text"
                    label="تأريخ انتهاء الخصم "
                    hide-details="auto"
                    class="font-weight-black text-field"
                    outlined
                    reverse
                    rounded
                    single-line
                    clearable
                    :rules="rules"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    persistent-hint
                    hint="يجب ادخال تأريخ انتهاء الخصم بعد تأريخ اليوم"></v-text-field>
                </template>
                <v-date-picker
                  v-model="selected_object.expaired"
                  @input="menu = false"></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                v-model="selected_object.min_value"
                type="text"
                label="اقل قيمة لأستخدام الخصم"
                hide-details="auto"
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
        <v-card-actions class="d-flex justify-center mt-2 pb-5">
          <v-btn
            @click="addCoupon"
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
      </v-form></v-card
    >
  </v-col>
</template>
<script>
  export default {
    data() {
      return {
        name: "",
        menu: null,

        rules: [(v) => !!v || "هذا الحقل مطلوب"],
      };
    },
    computed: {
      selected_object() {
        return this.$store.state.CouponModule.selected_object;
      },
      loading() {
        return this.$store.state.CouponModule.loading_add_coupon;
      },
    },
    methods: {
      addCoupon() {
        if (this.$refs.form.validate()) {
          let data = {};
          data["coupon_code"] = this.selected_object.coupon_code;
          data["coupon_ratio"] = this.selected_object.coupon_ratio;
          data["max_users"] = this.selected_object.max_users;
          data["min_value"] = this.selected_object.min_value;
          data["expaired"] = this.selected_object.expaired;
          this.$store.dispatch("CouponModule/addCoupon", data).then(() => {
            this.$refs.form.reset();
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
  .text-field >>> .error--text {
    text-align: right !important;
  }
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
