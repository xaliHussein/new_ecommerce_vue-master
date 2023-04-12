<template>
  <v-container>
    <OrdersTable />
  </v-container>
</template>
<script>
  import OrdersTable from "../components/tables/OrdersTable.vue";
  export default {
    components: {
      OrdersTable,
    },
  };
</script>
