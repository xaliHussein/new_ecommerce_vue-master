<template>
  <v-row justify="center">
    <v-dialog :value="dialogEdit" max-width="900px" dir="rtl" persistent>
      <v-card class="mx-auto mt-3" style="direction: rtl">
        <v-toolbar dark color="#624fc6" class="d-flex justify-center">
          <v-toolbar-title align-center>تعديل الخصم </v-toolbar-title>
        </v-toolbar>
        <v-form ref="update_coupon">
          <v-card-text class="mt-7">
            <v-row>
              <v-col cols="12" sm="6" md="4" lg="4">
                <v-text-field
                  v-model="updateCoupon.coupon_code"
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
                  v-model="updateCoupon.coupon_ratio"
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
                  v-model="updateCoupon.max_users"
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
                      v-model="updateCoupon.expaired"
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
                    v-model="updateCoupon.expaired"
                    @input="menu = false"></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" sm="4">
                <v-text-field
                  v-model="updateCoupon.min_value"
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
          <v-card-actions class="mt-2 pb-5">
            <v-btn
              @click="update_coupon"
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
      dialogEdit: {
        type: Boolean,
        default: false,
      },
      updateCoupon: {
        type: Object,
        default: null,
      },
    },
    computed: {
      loading() {
        return this.$store.state.CouponModule.pop_loading;
      },
    },
    methods: {
      update_coupon() {
        if (this.$refs.update_coupon.validate()) {
          let data = {};
          data["id"] = this.updateCoupon.id;
          data["coupon_code"] = this.updateCoupon.coupon_code;
          data["coupon_ratio"] = this.updateCoupon.coupon_ratio;
          data["max_users"] = this.updateCoupon.max_users;
          data["min_value"] = this.updateCoupon.min_value;
          data["expaired"] = this.updateCoupon.expaired;

          this.$store.dispatch("CouponModule/editCoupon", data).then(() => {
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
</style>
