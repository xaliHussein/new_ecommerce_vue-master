<template>
  <v-container>
    <v-card class="mb-5">
      <v-toolbar dark color="secondary">
        <v-toolbar-title align-center>اضافة خصم جديد</v-toolbar-title>
      </v-toolbar>
      <v-card-text> <couponForm></couponForm></v-card-text>
    </v-card>
    <v-divider></v-divider>
    <v-card class="mt-5"> <couponsTable></couponsTable> </v-card>
  </v-container>
</template>
<script>
import couponForm from "../components/forms/couponForm.vue";
import couponsTable from "../components/tables/couponsTable.vue";
export default {
  components: {
    couponForm,
    couponsTable,
  },
};
</script>
