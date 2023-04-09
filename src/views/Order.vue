<template>
  <v-container>
    <v-card class="mt-5">
      <OrdersTable />
    </v-card>
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
