<template>
  <v-container>
    <v-row>
      <ProductsForm />
    </v-row>
    <ProductsTable />
  </v-container>
</template>
<script>
  import ProductsForm from "../components/forms/ProductsForm.vue";
  import ProductsTable from "../components/tables/ProductsTable.vue";
  export default {
    components: {
      ProductsForm,
      ProductsTable,
    },
  };
</script>
