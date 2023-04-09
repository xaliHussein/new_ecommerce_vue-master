<template>
  <v-container>
    <v-row>
      <productsForm></productsForm>
    </v-row>
    <ProductsTable />
  </v-container>
</template>
<script>
  import productsForm from "../components/forms/productsForm.vue";
  import ProductsTable from "../components/tables/ProductsTable.vue";
  export default {
    components: {
      productsForm,
      ProductsTable,
    },
  };
</script>
