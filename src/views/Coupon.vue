<template>
  <v-container>
    <v-row>
      <CouponForm />
    </v-row>
    <CouponsTable />
  </v-container>
</template>
<script>
  import CouponForm from "../components/forms/CouponForm";
  import CouponsTable from "../components/tables/CouponsTable";
  export default {
    components: {
      CouponForm,
      CouponsTable,
    },
  };
</script>
