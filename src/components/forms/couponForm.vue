<template>
  <v-container>
    <v-form ref="form" class="mr-10">
      <v-col cols="12" md="12" lg="12">
        <v-row>
          <v-col cols="12" sm="3">
            <v-text-field
              v-model="selected_object.coupon_code"
              placeholder="كود الخصم "
              label="كود الخصم "
              hide-details="auto"
              :rules="rules"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="3">
            <v-text-field
              v-model="selected_object.coupon_ratio"
              placeholder="قيمة الخصم"
              label="قيمة الخصم"
              hide-details="auto"
              :rules="rules"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="3">
            <v-text-field
              v-model="selected_object.max_users"
              placeholder="اقصى عدد مستخدمين"
              label="اقصى عدد مستخدمين"
              hide-details="auto"
              :rules="rules"
              clearable
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="5">
            <v-menu
              v-model="menu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  clearable
                  v-model="selected_object.expaired"
                  label="تأريخ انتهاء الخصم "
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  hint="يجب ادخال تأريخ انتهاء الخصم بعد تأريخ اليوم"
                ></v-text-field>
                <span class="hint"
                  ># يجب ادخال تأريخ انتهاء الخصم بعد تأريخ اليوم</span
                >
              </template>
              <v-date-picker
                v-model="selected_object.expaired"
                @input="menu = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="selected_object.min_value"
              placeholder="اقل قيمة لأستخدام الخصم"
              label="اقل قيمة لأستخدام الخصم"
              hide-details="auto"
              :rules="rules"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="2" class="button_submit">
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
      name: "",
      menu: null,

      rules: [(v) => !!v || "اسم الماركة مطلوب"],
    };
  },
  components: {
    VueUploadMultipleImage,
  },
  computed: {
    selected_object() {
      return this.$store.state.CouponModule.selected_object;
    },
    isEdit() {
      return this.$store.state.CouponModule.isEdit;
    },
  },
  methods: {
    validateField() {
      if (this.$refs.form.validate()) {
        let data = {};
        data["coupon_code"] = this.selected_object.coupon_code;
        data["coupon_ratio"] = this.selected_object.coupon_ratio;
        data["max_users"] = this.selected_object.max_users;
        data["min_value"] = this.selected_object.min_value;
        data["expaired"] = this.selected_object.expaired;
        if (this.isEdit) {
          data["id"] = this.selected_object.id;
          this.editCoupon(data);
        } else {
          this.addCoupon(data);
        }
      }
    },
    addCoupon(data) {
      this.$store.dispatch("CouponModule/addCoupon", data);
      this.reset();
    },
    editCoupon(data) {
      console.log(data);
      this.$store.dispatch("CouponModule/editCoupon", data);
      this.reset();
    },
    reset() {
      this.$refs.form.reset();
      this.$store.state.CouponModule.isEdit = false;
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
